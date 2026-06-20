import { getStore } from "@netlify/blobs";

const SM_ENDPOINT = "https://api.supermetrics.com/enterprise/v2/query/data/json";
const BLOB_KEY = "tameed-live.json";

// Run one saved Supermetrics query. The query JSON comes from an env var; we
// merge in the api_key (a secret env var, never in code), url-encode the whole
// thing, and return the data rows with the header row dropped.
async function smQuery(queryJson, apiKey) {
  const payload = { ...JSON.parse(queryJson), api_key: apiKey };
  const url = `${SM_ENDPOINT}?json=${encodeURIComponent(JSON.stringify(payload))}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supermetrics ${res.status}: ${body.slice(0, 500)}`);
  }
  const json = await res.json();
  const rows = json?.data;
  if (!Array.isArray(rows) || rows.length < 2) {
    throw new Error("Unexpected Supermetrics response: missing data rows");
  }
  return rows.slice(1); // drop the header row
}

// Return the existing dashboard JSON from Blobs, self-seeding from SEED_URL
// (the prior live tameed-live.json) the first time the store is empty.
async function getOrSeed(store) {
  let existing = await store.get(BLOB_KEY, { type: "json" });
  if (existing?.channels) return existing;

  const seedUrl = process.env.SEED_URL;
  if (!seedUrl) throw new Error("Blobs empty and SEED_URL not set");
  const res = await fetch(seedUrl, { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error(`Seed fetch failed: ${res.status}`);
  existing = await res.json();
  await store.setJSON(BLOB_KEY, existing);
  return existing;
}

export default async () => {
  const apiKey = process.env.SUPERMETRICS_API_KEY;
  const metricsJson = process.env.SM_GOOGLE_METRICS_JSON;
  const signupsJson = process.env.SM_GOOGLE_SIGNUPS_JSON;
  if (!apiKey || !metricsJson || !signupsJson) {
    return new Response(
      "Missing env: need SUPERMETRICS_API_KEY, SM_GOOGLE_METRICS_JSON, SM_GOOGLE_SIGNUPS_JSON",
      { status: 500 }
    );
  }

  // Two separate queries: Google Ads can't combine the conversion-action
  // filter with impressions/clicks/cost in one report.
  // metricRows = [Date, Impressions, Clicks, Cost_eur]; signupRows = [Date, Conversions]
  const [metricRows, signupRows] = await Promise.all([
    smQuery(metricsJson, apiKey),
    smQuery(signupsJson, apiKey),
  ]);

  // Conversions ("leads") are modeled decimals (e.g. 7.18). Aggregate per date,
  // then round to whole numbers at the end.
  const leadsByDate = new Map();
  for (const [date, conversions] of signupRows) {
    leadsByDate.set(date, (leadsByDate.get(date) || 0) + (Number(conversions) || 0));
  }

  const metricByDate = new Map();
  for (const [date, impr, clicks, cost] of metricRows) {
    const m = metricByDate.get(date) || { impr: 0, clicks: 0, cost: 0 };
    m.impr += Number(impr) || 0;
    m.clicks += Number(clicks) || 0;
    m.cost += Number(cost) || 0;
    metricByDate.set(date, m);
  }

  const last28 = [...metricByDate.keys()].sort().slice(-28);
  const impr = [], clicks = [], cost = [], leads = [];
  for (const d of last28) {
    const m = metricByDate.get(d);
    impr.push(Math.round(m.impr));
    clicks.push(Math.round(m.clicks));
    cost.push(Math.round(m.cost * 100) / 100);          // raw EUR, 2 dp
    leads.push(Math.round(leadsByDate.get(d) || 0));    // whole numbers
  }

  // Update ONLY channels.Google; leave start, days, fx, and the other 5
  // channels untouched.
  const store = getStore({ name: "tameed", consistency: "strong" });
  const existing = await getOrSeed(store);

  existing.channels.Google = { currency: "EUR", impr, clicks, cost, leads };
  existing.updated = new Date().toISOString();
  await store.setJSON(BLOB_KEY, existing);

  return new Response(`OK updated Google: ${last28.length} days`, { status: 200 });
};
