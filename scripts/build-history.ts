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
  }
  return dates;
}

function phaseMessage(index: number, total: number, fileHint: string): string {
  const progress = index / total;
  const file = fileHint.split("/").pop() ?? fileHint;

  if (progress < 0.12) {
    const pool = [
      `chore: bootstrap ${file}`,
      `chore: wire project config for ${file}`,
      `style: early layout pass on ${file}`,
      `docs: note setup for ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.28) {
    const pool = [
      `feat: add universe model touch ${file}`,
      `feat: scaffold character surfaces via ${file}`,
      `refactor: tidy data layer around ${file}`,
      `chore: prisma-related update ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.45) {
    const pool = [
      `feat: episode archive work in ${file}`,
      `feat: location lore updates ${file}`,
      `feat: seed arcane content via ${file}`,
      `fix: correct synopsis copy in ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.6) {
    const pool = [
      `feat: auth plumbing in ${file}`,
      `feat: profile favorites via ${file}`,
      `fix: session callback hardening ${file}`,
      `chore: credential form polish ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.75) {
    const pool = [
      `feat: wiki article flow ${file}`,
      `feat: editor desk updates ${file}`,
      `feat: search indexing path ${file}`,
      `docs: article authoring notes ${file}`,
    ];
    return pool[index % pool.length];
  }
  if (progress < 0.9) {
    const pool = [
      `feat: multi-universe hub polish ${file}`,
      `style: cinematic theme pass ${file}`,
      `perf: dynamic route metadata ${file}`,
      `refactor: shared entity cards ${file}`,
    ];
    return pool[index % pool.length];
  }
  const pool = [
    `docs: readme and deploy notes ${file}`,
    `chore: vercel config tweak ${file}`,
    `fix: late polish on ${file}`,
    `test: smoke-friendly structure ${file}`,
  ];
  return pool[index % pool.length];
}

function chunkBuffer(content: Buffer, parts: number): Buffer[] {
  if (parts <= 1) return [content];
  const text = content.toString("utf8");
  if (text.includes("\u0000")) {
    return [content];
  }
  const lines = text.split("\n");
  if (lines.length < parts) {
    return Array.from({ length: parts }, (_, i) =>
      Buffer.from(
        i === parts - 1
          ? text
          : text.slice(
              0,
              Math.max(1, Math.floor(text.length * ((i + 1) / parts))),
            ),
        "utf8",
      ),
    );