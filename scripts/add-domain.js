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
const CF_EMAIL = process.env.CF_API_EMAIL;
const CF_KEY = process.env.CF_API_KEY;
const TARGET = "directmatch.com";

// Two auth modes:
//   - Global API Key (email + key): full account access, can create zones
//   - Scoped Bearer token: only works if it has zone-create permission
const useGlobalKey = Boolean(CF_EMAIL && CF_KEY);

if (!CF_ACCOUNT || (!useGlobalKey && !CF_TOKEN)) {
  console.error(`
❌  Missing environment variables.

Recommended (can create zones) — add to .env:
  CF_API_EMAIL=your_cloudflare_login_email
  CF_API_KEY=your_global_api_key
  CF_ACCOUNT_ID=your_cloudflare_account_id

Get Global API Key: dash.cloudflare.com/profile/api-tokens
  → "Global API Key" → View

Get Account ID from: Cloudflare dashboard → right sidebar
`);
  process.exit(1);
}

// ── Cloudflare API helpers ───────────────────────────────────────────────────
const CF = "https://api.cloudflare.com/client/v4";

const authHeaders = useGlobalKey
  ? { "X-Auth-Email": CF_EMAIL, "X-Auth-Key": CF_KEY }
  : { Authorization: `Bearer ${CF_TOKEN}` };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sentinel thrown when the account's pending-zone limit is reached
class ZoneLimitError extends Error {}

async function cfFetch(path, options = {}, attempt = 0) {
  const res = await fetch(`${CF}${path}`, {
    ...options,
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!json.success) {
    const msg = json.errors?.map((e) => e.message).join(", ") || "Unknown error";
    // Code 971 = rate limit. Back off and retry up to 5 times.
    if (json.errors?.some((e) => e.code === 971) && attempt < 5) {
      await sleep(3000 * (attempt + 1));
      return cfFetch(path, options, attempt + 1);
    }
    if (/exceeded the limit for adding zones/i.test(msg)) {
      throw new ZoneLimitError(msg);
    }
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

// A proxied CNAME alone returns HTTP 522 — the Worker that renders the site
// must be bound to the hostname via a Workers route, or Cloudflare has no
// origin to serve and the domain is effectively down.
const WORKER_SCRIPT = "directmatch";

async function addWorkerRoute(zoneId, pattern) {
  return cfFetch(`/zones/${zoneId}/workers/routes`, {
    method: "POST",
    body: JSON.stringify({ pattern, script: WORKER_SCRIPT }),
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

  // Bind the Worker so the domain actually serves the site (prevents 522)
  await addWorkerRoute(zone.id, `${domain}/*`);
  await addWorkerRoute(zone.id, `www.${domain}/*`);

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

// Cloudflare assigns nameservers per-zone — they can differ between domains.
// Group added domains by their assigned NS pair.
const nsGroups = {};
let added = 0;
let skipped = 0;
let hitLimit = false;

for (const domain of domains) {
  try {
    const result = await addDomain(domain);
    if (result) {
      added++;
      const key = [...result.nameservers].sort().join(" / ");
      (nsGroups[key] = nsGroups[key] || []).push(result.domain);
    } else {
      skipped++;
    }
  } catch (err) {
    if (err instanceof ZoneLimitError) {
      hitLimit = true;
      console.log("⏸  zone limit reached — stopping");
      break;
    }
    console.log(`❌  ${err.message}`);
  }
  await sleep(1200); // throttle to stay under Cloudflare rate limits
}

console.log(`\n──────────────────────────────────────────`);
console.log(`✅  ${added} added   ⚠️  ${skipped} skipped`);

if (hitLimit) {
  console.log(`
⏸  Cloudflare's pending-zone limit was reached. Change the nameservers
   on the domains already added so they activate, then re-run this script
   to add the rest. Already-added domains are skipped automatically.`);
}

const groups = Object.entries(nsGroups);
if (groups.length) {
  console.log(`\nSet these nameservers at your registrar (grouped by NS pair):`);
  for (const [ns, ds] of groups) {
    console.log(`\n  Nameservers: ${ns}`);
    console.log(ds.map((d) => `    ${d}`).join("\n"));
  }
  console.log("");
}
