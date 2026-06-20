import { getStore } from "@netlify/blobs";

const BLOB_KEY = "tameed-live.json";

// Serve the dashboard JSON from the Netlify Blobs "tameed" store. If the store
// is empty (first request after deploy), self-seed it from SEED_URL — the prior
// live tameed-live.json — so the dashboard never sees missing data.
export default async () => {
  const store = getStore({ name: "tameed", consistency: "strong" });
  let data = await store.get(BLOB_KEY, { type: "json" });

  if (!data) {
    const seedUrl = process.env.SEED_URL;
    if (seedUrl) {
      try {
        const res = await fetch(seedUrl, { headers: { "cache-control": "no-cache" } });
        if (res.ok) {
          data = await res.json();
          await store.setJSON(BLOB_KEY, data);
        }
      } catch {
        /* fall through to 503 below */
      }
    }
  }

  if (!data) {
    return new Response(JSON.stringify({ error: "not seeded yet" }), {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
};
