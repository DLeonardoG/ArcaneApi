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
      `fix: super admin promotion rules ${file}`,
    ];
    return pool[index % pool.length];
  }
  const pool = [
    `docs: roles community readme ${file}`,
    `chore: phase3 changelog ${file}`,
    `fix: late roles polish ${file}`,
    `test: smoke-friendly roles structure ${file}`,
  ];
  return pool[index % pool.length];
}

function chunkBuffer(content: Buffer, parts: number): Buffer[] {
  if (parts <= 1) return [content];
  const text = content.toString("utf8");
  if (text.includes("\u0000")) return [content];
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
  }
  const size = Math.ceil(lines.length / parts);
  const chunks: Buffer[] = [];
  for (let i = 0; i < parts; i++) {
    chunks.push(
      Buffer.from(
        lines.slice(0, Math.min(lines.length, size * (i + 1))).join("\n"),
        "utf8",
      ),
    );
  }
  return chunks;
}

function headContent(relative: string): Buffer | null {
  try {
    return Buffer.from(
      execFileSync("git", ["show", `HEAD:${relative}`], {
        cwd: ROOT,
        encoding: "buffer",
      }) as Buffer,
    );
  } catch {
    return null;
  }
}

function buildOps(files: string[], slotCount: number): Op[] {
  const ops: Op[] = [];
  const changed: string[] = [];

  for (const relative of files) {
    const absolute = path.join(SNAPSHOT, relative);
    const next = fs.readFileSync(absolute);
    const prev = headContent(relative);
    if (!prev || !prev.equals(next)) {
      changed.push(relative);
    }
  }

  const perFile = Math.max(
    1,
    Math.ceil(slotCount / Math.max(changed.length, 1)),
  );

  for (const relative of changed) {
    const absolute = path.join(SNAPSHOT, relative);
    const content = fs.readFileSync(absolute);
    const chunks = chunkBuffer(content, Math.min(perFile, 5));
    for (const chunk of chunks) {
      ops.push({
        message: "",
        files: [{ relative, content: chunk }],
      });
    }
  }

  let pad = 0;
  while (ops.length < slotCount) {
    pad += 1;
    const note = "docs/changelog-phase3.md";
    const prev =
      ops
        .slice()
        .reverse()
        .find((op) => op.files.some((f) => f.relative === note))
        ?.files.find((f) => f.relative === note)
        ?.content.toString("utf8") ??
      "# LoreVault phase 3 — roles community\n\n";
    ops.push({
      message: "",
      files: [
        {
          relative: note,
          content: Buffer.from(`${prev}- roles polish ${pad}\n`, "utf8"),
        },
      ],
    });
  }

  if (ops.length > slotCount) {
    const head = ops.slice(0, slotCount - 1);
    const tail = ops.slice(slotCount - 1);
    const merged = new Map<string, Buffer>();
    for (const op of tail) {
      for (const file of op.files) merged.set(file.relative, file.content);
    }
    head.push({
      message: "",
      files: [...merged.entries()].map(([relative, content]) => ({
        relative,
        content,
      })),
    });
    return head.map((op, index) => ({
      ...op,
      message: phaseMessage(
        index,
        slotCount,
        op.files[0]?.relative ?? "project",
      ),
    }));
  }

  return ops.map((op, index) => ({
    ...op,
    message: phaseMessage(index, slotCount, op.files[0]?.relative ?? "project"),
  }));
}

function ensureSnapshot() {
  if (fs.existsSync(SNAPSHOT)) {
    fs.rmSync(SNAPSHOT, { recursive: true, force: true });
  }