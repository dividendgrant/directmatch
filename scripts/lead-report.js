#!/usr/bin/env node
/**
 * Per-domain inquiry tally — reads the D1 'inquiries' table.
 *
 * Shows how many real inquiries each domain has produced, so keep/cut/Afternic
 * decisions are driven by LEADS, not bot traffic. Cross-reference the actual
 * emails in Gmail for validity and buyer details.
 *
 * Usage:
 *   node scripts/lead-report.js            # all time
 *   node scripts/lead-report.js 30         # last 30 days
 *
 * Requires CF_API_EMAIL + CF_API_KEY + CF_ACCOUNT_ID in .env (loaded below).
 */
import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length && !process.env[k.trim()]) {
      process.env[k.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const days = parseInt(process.argv[2] || "0", 10);
const where = days > 0 ? `WHERE created_at >= datetime('now','-${days} days')` : "";
const sql =
  `SELECT domain, COUNT(*) AS inquiries, MAX(created_at) AS last_inquiry ` +
  `FROM inquiries ${where} GROUP BY domain ORDER BY inquiries DESC;`;

const env = {
  ...process.env,
  CLOUDFLARE_EMAIL: process.env.CF_API_EMAIL,
  CLOUDFLARE_API_KEY: process.env.CF_API_KEY,
  CLOUDFLARE_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
  CI: "true",            // suppress interactive prompts
  WRANGLER_SEND_METRICS: "false",
};

console.log(`\nInquiries per domain ${days > 0 ? `(last ${days} days)` : "(all time)"}:\n`);
try {
  const out = execSync(
    `npx wrangler d1 execute directmatch-leads --remote --json --command ${JSON.stringify(sql)}`,
    { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
  // wrangler prints a banner before the JSON — extract the JSON array
  const start = out.indexOf("[");
  const end = out.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No JSON in output:\n" + out);
  const json = JSON.parse(out.slice(start, end + 1));
  const rows = json[0]?.results ?? [];
  if (!rows.length) {
    console.log("  (no inquiries logged yet)");
  } else {
    let total = 0;
    console.log("  INQ   DOMAIN                          LAST INQUIRY");
    console.log("  " + "─".repeat(60));
    for (const r of rows) {
      total += r.inquiries;
      console.log(
        "  " +
          String(r.inquiries).padStart(4) +
          "   " +
          (r.domain || "(none)").padEnd(30) +
          "  " +
          (r.last_inquiry || "")
      );
    }
    console.log(`\n  ${rows.length} domains with inquiries · ${total} total`);
  }
} catch (err) {
  console.error("Query failed:", err.stdout?.toString() || err.message);
  process.exit(1);
}
