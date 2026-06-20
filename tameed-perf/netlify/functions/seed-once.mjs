import { getStore } from "@netlify/blobs";

const BLOB_KEY = "tameed-live.json";

// TEMPORARY — run once to seed the Blobs store with the current live JSON so
// the dashboard has all 6 channels before the first refresh-google. Delete
// this file after seeding (run order step 9).
//
// Must run while the /tameed-live.json redirect is still COMMENTED, so this
// fetch hits the existing static file and not the (empty) serve-google function.
export default async () => {
  const res = await fetch("https://rvnu.live/tameed-live.json", {
    headers: { "cache-control": "no-cache" },
  });
  if (!res.ok) {
    return new Response(`Fetch failed: ${res.status}`, { status: 502 });
  }

  const data = await res.json();
  const channelCount = data?.channels ? Object.keys(data.channels).length : 0;

  const store = getStore("tameed");
  await store.setJSON(BLOB_KEY, data);

  return new Response(`seeded ${channelCount} channels`, { status: 200 });
};
