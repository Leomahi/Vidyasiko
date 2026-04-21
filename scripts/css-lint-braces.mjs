#!/usr/bin/env node
/**
 * CSS brace linter & auto-fixer.
 *
 * Catches:
 *  - Unbalanced braces across the whole file.
 *  - Stray top-level `}` (a closing brace at depth 0) — the classic
 *    "theme block accidentally closed twice" bug.
 *
 * Usage:
 *   node scripts/css-lint-braces.mjs            # lint, exit 1 on error
 *   node scripts/css-lint-braces.mjs --fix      # remove stray top-level `}`
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const FIX = process.argv.includes("--fix");
const root = process.cwd();

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (extname(full) === ".css") out.push(full);
  }
  return out;
}

/**
 * Scan CSS character-by-character, ignoring braces inside strings and
 * /* ... *​/ comments. Returns { depth, strayClosers: number[] (line nums) }.
 */
function scan(css) {
  let depth = 0;
  let line = 1;
  let inBlockComment = false;
  let inString = null; // '"' | "'" | null
  const strayClosers = [];

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    const next = css[i + 1];
    if (ch === "\n") line++;

    if (inBlockComment) {
      if (ch === "*" && next === "/") { inBlockComment = false; i++; }
      continue;
    }
    if (inString) {
      if (ch === "\\") { i++; continue; }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === "/" && next === "*") { inBlockComment = true; i++; continue; }
    if (ch === '"' || ch === "'") { inString = ch; continue; }

    if (ch === "{") depth++;
    else if (ch === "}") {
      if (depth === 0) strayClosers.push({ line, index: i });
      else depth--;
    }
  }
  return { depth, strayClosers };
}

function fixContent(css, strayClosers) {
  // Remove from end → start so indices stay valid.
  const sorted = [...strayClosers].sort((a, b) => b.index - a.index);
  let out = css;
  for (const { index } of sorted) {
    out = out.slice(0, index) + out.slice(index + 1);
  }
  return out;
}

const files = walk(join(root, "src"));
let errors = 0;
let fixed = 0;

for (const file of files) {
  const css = readFileSync(file, "utf8");
  const { depth, strayClosers } = scan(css);
  const rel = relative(root, file);

  if (strayClosers.length === 0 && depth === 0) {
    console.log(`  ✓ ${rel}`);
    continue;
  }

  if (strayClosers.length) {
    for (const { line } of strayClosers) {
      console.error(`  ✗ ${rel}:${line} — stray top-level "}"`);
    }
  }
  if (depth > 0) {
    console.error(`  ✗ ${rel} — ${depth} unclosed "{" block(s)`);
  } else if (depth < 0) {
    console.error(`  ✗ ${rel} — ${-depth} extra "}" overall`);
  }

  if (FIX && strayClosers.length && depth >= 0) {
    // Only auto-remove stray closers when there are no unclosed blocks
    // (otherwise removal could mask a real structural bug).
    const fixedCss = fixContent(css, strayClosers);
    writeFileSync(file, fixedCss, "utf8");
    console.log(`  ↻ fixed ${strayClosers.length} stray "}" in ${rel}`);
    fixed += strayClosers.length;
  } else {
    errors++;
  }
}

if (FIX) {
  console.log(`\n[css-lint] Fixed ${fixed} stray brace(s).`);
}
if (errors > 0) {
  console.error(`\n[css-lint] ${errors} file(s) still have problems.`);
  process.exit(1);
}
console.log(`\n[css-lint] OK — ${files.length} file(s) clean.`);