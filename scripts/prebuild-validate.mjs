#!/usr/bin/env node
/**
 * Prebuild validator:
 *  1) Refresh browserslist DB (best-effort, non-fatal).
 *  2) Validate CSS syntax via PostCSS for all .css files in src/.
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import postcss from "postcss";

const root = process.cwd();

function log(step, msg) {
  console.log(`\n[prebuild:${step}] ${msg}`);
}

// 1) Browserslist update (non-fatal)
try {
  log("browserslist", "Updating caniuse-lite database…");
  execSync("npx --yes update-browserslist-db@latest", { stdio: "inherit" });
} catch (err) {
  console.warn(`[prebuild:browserslist] Skipped (non-fatal): ${err.message}`);
}

// 2) CSS syntax validation
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (extname(full) === ".css") out.push(full);
  }
  return out;
}

const cssFiles = walk(join(root, "src"));
log("css", `Validating ${cssFiles.length} CSS file(s)…`);

let failed = 0;
for (const file of cssFiles) {
  const css = readFileSync(file, "utf8");
  try {
    postcss.parse(css, { from: file });
    console.log(`  ✓ ${file.replace(root + "/", "")}`);
  } catch (err) {
    failed++;
    const line = err.line ?? "?";
    const col = err.column ?? "?";
    console.error(`  ✗ ${file}:${line}:${col} — ${err.reason || err.message}`);
  }
}

if (failed > 0) {
  console.error(`\n[prebuild] ${failed} CSS file(s) failed syntax validation.`);
  process.exit(1);
}
log("done", "All checks passed.");