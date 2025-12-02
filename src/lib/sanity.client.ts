// lib/sanity.client.ts
import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = "2024-01-01";
const token = process.env.SANITY_READ_TOKEN; // optional

if (!projectId) {
  throw new Error(
    "❌ Missing SANITY_PROJECT_ID. Set it in Vercel → Settings → Environment Variables."
  );
}

if (!dataset) {
  throw new Error(
    "❌ Missing SANITY_DATASET. Set it in Vercel → Settings → Environment Variables."
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
});
