#!/usr/bin/env node
/**
 * HammerGold / DirectMatch — Cloudflare domain onboarding script
 *
 * Automates steps 2 & 3 of adding a parked domain:
 *   1. Creates the zone in Cloudflare
 *   2. Adds CNAME @ → directmatch.com (proxied)
 *   3. Adds CNAME www → directmatch.com (proxied)
 *   4. Prints the nameservers to paste into your registrar
 *
 * Usage:
 *   node scripts/add-domain.js aifin.com
 *   node scripts/add-domain.js aifin.com dmu.com solholdings.com
 *   node scripts/add-domain.js --file scripts/domains.txt
 *
 * Setup (one-time):
 *   1. Create a Cloudflare API token at dash.cloudflare.com/profile/api-tokens
 *      Template: "Edit zone DNS" — set Zone Resources to "All zones"
 *   2. Find your Account ID: Cloudflare dashboard → right sidebar on any zone page
 *   3. Add to .env:
 *        CF_API_TOKEN=your_token_here
 *        CF_ACCOUNT_ID=your_account_id_here
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// ── Load .env manually (no dependency needed) ────────────────────────────────
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const CF_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT = process.env.CF_ACCOUNT_ID;
const TARGET = "directmatch.com";

if (!CF_TOKEN || !CF_ACCOUNT) {
  console.error(`
❌  Missing environment variables.

Add these to your .env file:
  CF_API_TOKEN=your_cloudflare_api_token
  CF_ACCOUNT_ID=your_cloudflare_account_id

Get your API token at: dash.cloudflare.com/profile/api-tokens
  Template: "Edit zone DNS", Zone Resources: All zones

Get your Account ID from: Cloudflare dashboard → right sidebar
`);
  process.exit(1);
}

// ── Cloudflare API helpers ───────────────────────────────────────────────────
const CF = "https://api.cloudflare.com/client/v4";

async function cfFetch(path, options = {}) {
  const res = await fetch(`${CF}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!json.success) {
    const msg = json.errors?.map((e) => e.message).join(", ") || "Unknown error";
    throw new Error(`Cloudflare API error: ${msg}`);
  }
  return json.result;
}

async function createZone(domain) {
  return cfFetch("/zones", {
    method: "POST",
    body: JSON.stringify({
      name: domain,
      account: { id: CF_ACCOUNT },
      jump_start: false,
    }),
  });
}

async function addCname(zoneId, name) {
  return cfFetch(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: JSON.stringify({
      type: "CNAME",
      name,
      content: TARGET,
      proxied: true,
      ttl: 1, // auto
    }),
  });
}

// ── Process one domain ───────────────────────────────────────────────────────
async function addDomain(domain) {
  domain = domain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  process.stdout.write(`  ${domain} ... `);

  let zone;
  try {
    zone = await createZone(domain);
  } catch (err) {
    if (err.message.includes("already exists")) {
      console.log("⚠️  already in Cloudflare (skipped)");
      return null;
    }
    throw err;
  }

  await addCname(zone.id, "@");
  await addCname(zone.id, "www");

  const ns = zone.name_servers || [];
  console.log(`✅  done`);
  return { domain, nameservers: ns };
}

// ── Parse arguments ──────────────────────────────────────────────────────────
let domains = [];
const args = process.argv.slice(2);

const fileFlag = args.indexOf("--file");
if (fileFlag !== -1) {
  const filePath = args[fileFlag + 1];
  if (!filePath || !existsSync(filePath)) {
    console.error(`❌  File not found: ${filePath}`);
    process.exit(1);
  }
  domains = readFileSync(filePath, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
} else {
  domains = args.filter((a) => !a.startsWith("--"));
}

if (!domains.length) {
  console.error(`
Usage:
  node scripts/add-domain.js aifin.com
  node scripts/add-domain.js aifin.com dmu.com solholdings.com
  node scripts/add-domain.js --file scripts/domains.txt

The domains.txt file should have one domain per line.
`);
  process.exit(1);
}

// ── Run ──────────────────────────────────────────────────────────────────────
console.log(`\nAdding ${domains.length} domain(s) to Cloudflare → ${TARGET}\n`);

let nameservers = null;
let added = 0;
let skipped = 0;

for (const domain of domains) {
  try {
    const result = await addDomain(domain);
    if (result) {
      added++;
      nameservers = nameservers ?? result.nameservers; // all domains share the same NS
    } else {
      skipped++;
    }
  } catch (err) {
    console.log(`❌  ${err.message}`);
  }
}

console.log(`\n──────────────────────────────────────────`);
console.log(`✅  ${added} added   ⚠️  ${skipped} skipped`);

if (nameservers?.length) {
  console.log(`
Set these nameservers at your registrar for all added domains:

  ${nameservers.join("\n  ")}

These are the same for every domain in your Cloudflare account.
`);
}
