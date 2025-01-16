/**
 * Builds a simulated development history on top of the existing root commit.
 * Range: 2024-12-24 → 2025-07-23
 * Cadence: 3 commits/day, 1 on Saturdays
 *
 * Usage: pnpm history:build
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const SNAPSHOT = path.join(os.tmpdir(), "lorevault-history-snapshot");
const START = new Date(2024, 11, 24);
const END = new Date(2025, 6, 23);
const SLOT_HOURS = [10, 15, 21];

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  ".lorevault-final",
  ".vercel",
  "coverage",
]);

const IGNORE_FILES = new Set([".env"]);

const PROTECTIVE_GITIGNORE = [
  "node_modules/",
  ".next/",
  ".env",
  ".env.local",
  ".env.*.local",
  ".lorevault-final/",
  ".vercel/",
  "*.tsbuildinfo",
  "",
].join("\n");

type Op = {
  message: string;
  files: { relative: string; content: Buffer }[];
};

function git(args: string[], env?: Record<string, string>) {
  execFileSync("git", args, {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

function gitOut(args: string[]): string {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
}

function listFiles(dir: string, base = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(full, base));
      continue;
    }
    if (IGNORE_FILES.has(entry.name)) continue;
    if (entry.name.endsWith(".tsbuildinfo")) continue;
    out.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return out.sort();
}

function buildCalendar(): Date[] {
  const dates: Date[] = [];
  const cursor = new Date(START);
  while (cursor <= END) {
    const isSaturday = cursor.getDay() === 6;
    const hours = isSaturday ? [12] : SLOT_HOURS;
    for (const hour of hours) {
      const stamp = new Date(cursor);
      stamp.setHours(hour, 10 + (dates.length % 40), dates.length % 50, 0);
      dates.push(stamp);
    }
    cursor.setDate(cursor.getDate() + 1);