import { getStore } from "@netlify/blobs";

const BLOB_KEY = "tameed-live.json";

// Serve the live dashboard JSON straight from the Netlify Blobs "tameed" store.
// Wired to /tameed-live.json via the (initially commented) redirect in netlify.toml.
export default async () => {
  const store = getStore("tameed");
  const data = await store.get(BLOB_KEY, { type: "json" });

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
