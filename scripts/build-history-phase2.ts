/**
 * Phase-2 simulated history on top of current HEAD (does not rewrite phase 1).
 * Range: 2025-07-24 → 2026-01-23
 * Cadence: 3 commits/day, 1 on Saturdays
 *
 * Usage: pnpm history:phase2
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const SNAPSHOT = path.join(os.tmpdir(), "lorevault-history-phase2");
const START = new Date(2025, 6, 24);
const END = new Date(2026, 0, 23);
const SLOT_HOURS = [10, 15, 21];

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  ".lorevault-final",
  ".vercel",
  "coverage",
  ".neon",
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
  ".neon/",
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
  }
  return dates;
}

function phaseMessage(index: number, total: number, fileHint: string): string {
  const progress = index / total;
  const file = fileHint.split("/").pop() ?? fileHint;

  if (progress < 0.16) {
    const pool = [
      `feat: engagement schema touch ${file}`,
      `chore: media asset fields via ${file}`,
      `feat: imageUrl columns in ${file}`,
      `docs: engagement data notes ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.33) {
    const pool = [
      `feat: comment actions in ${file}`,
      `feat: rating upsert flow ${file}`,
      `fix: comment validation ${file}`,
      `refactor: engagement helpers ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.5) {
    const pool = [
      `feat: gallery media actions ${file}`,
      `feat: vercel blob upload path ${file}`,
      `chore: blob dependency wiring ${file}`,
      `fix: cover image assignment ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.66) {
    const pool = [
      `feat: studio publish desk ${file}`,
      `feat: create character from studio ${file}`,
      `feat: studio tabs navigation ${file}`,
      `docs: studio authoring guide ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.83) {
    const pool = [
      `feat: wire engagement on detail pages ${file}`,
      `feat: profile ratings and comments ${file}`,
      `style: engagement panel layout ${file}`,
      `refactor: entity engagement wrapper ${file}`,