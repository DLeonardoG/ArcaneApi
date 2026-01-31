/**
 * Phase-3 simulated history on top of current HEAD (preserves phases 1–2).
 * Range: 2026-01-24 → 2026-04-23
 * Cadence: cycling 3, 4, 2, 5 commits per day
 *
 * Usage: pnpm history:phase3
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const SNAPSHOT = path.join(os.tmpdir(), "lorevault-history-phase3");
const START = new Date(2026, 0, 24);
const END = new Date(2026, 3, 23);
const DAILY_PATTERN = [3, 4, 2, 5];
const SLOT_HOURS = [9, 12, 15, 18, 21];

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
  let dayIndex = 0;
  while (cursor <= END) {
    const count = DAILY_PATTERN[dayIndex % DAILY_PATTERN.length];
    for (let slot = 0; slot < count; slot++) {
      const stamp = new Date(cursor);
      const hour = SLOT_HOURS[slot % SLOT_HOURS.length];
      stamp.setHours(hour, 8 + ((dates.length + slot) % 45), dates.length % 50, 0);
      dates.push(stamp);
    }
    dayIndex += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function phaseMessage(index: number, total: number, fileHint: string): string {
  const progress = index / total;
  const file = fileHint.split("/").pop() ?? fileHint;

  if (progress < 0.16) {
    const pool = [
      `feat: super admin role enum via ${file}`,
      `feat: role request model in ${file}`,
      `chore: permissions helpers seed ${file}`,
      `docs: community role notes ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.33) {
    const pool = [
      `feat: submit role request action ${file}`,
      `feat: review role request flow ${file}`,
      `fix: pending request uniqueness ${file}`,
      `refactor: canSetUserRole checks ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.5) {
    const pool = [
      `feat: profile role application UI ${file}`,
      `feat: admin request queue ${file}`,
      `style: admin community cards ${file}`,
      `docs: editor pitch copy ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.66) {
    const pool = [
      `feat: lock image uploads to editors ${file}`,
      `fix: media permission gate ${file}`,
      `chore: jwt role refresh ${file}`,
      `refactor: permissions module split ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.83) {
    const pool = [
      `feat: member role management panel ${file}`,
      `feat: nav admin link gating ${file}`,
      `style: role access profile section ${file}`,