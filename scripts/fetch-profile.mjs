#!/usr/bin/env node
/**
 * Fetch jajera/jajera README into data/profile.md for the CV build.
 * Override with PROFILE_README_PATH for local offline builds.
 * On network failure, keep the existing data/profile.md snapshot if present.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'data', 'profile.md');
const site = JSON.parse(await readFile(path.join(root, 'site.json'), 'utf8'));
const { owner, repo, path: readmePath, ref } = site.profileReadme;

await mkdir(path.dirname(outPath), { recursive: true });

const localOverride = process.env.PROFILE_README_PATH;
let markdown;

try {
  if (localOverride) {
    markdown = await readFile(localOverride, 'utf8');
    console.log(`Fetched profile from local path ${localOverride}`);
  } else {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${readmePath}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    markdown = await res.text();
    console.log(`Fetched profile from ${url}`);
  }
} catch (err) {
  try {
    await access(outPath);
    console.warn(`Fetch failed (${err.message}); keeping existing ${outPath}`);
    process.exit(0);
  } catch {
    throw err;
  }
}

await writeFile(outPath, markdown, 'utf8');
console.log(`Wrote ${outPath}`);
