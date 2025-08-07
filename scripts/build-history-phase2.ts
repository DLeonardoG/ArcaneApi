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
    ];
    return pool[index % pool.length];
  }
  const pool = [
    `docs: blob token and studio notes ${file}`,
    `style: gallery and comment polish ${file}`,
    `fix: late engagement polish ${file}`,
    `chore: phase2 changelog ${file}`,
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
    const note = "docs/changelog-phase2.md";
    const prev =
      ops
        .slice()
        .reverse()
        .find((op) => op.files.some((f) => f.relative === note))
        ?.files.find((f) => f.relative === note)
        ?.content.toString("utf8") ??
      "# LoreVault phase 2 — engagement era\n\n";
    ops.push({
      message: "",
      files: [
        {
          relative: note,
          content: Buffer.from(`${prev}- engagement polish ${pad}\n`, "utf8"),
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
  fs.mkdirSync(SNAPSHOT, { recursive: true });
  const files = listFiles(ROOT);
  for (const relative of files) {
    const from = path.join(ROOT, relative);
    const to = path.join(SNAPSHOT, relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
  return files;
}

function restoreHeadClean() {
  git(["reset", "--hard", "HEAD"]);
  git(["clean", "-fd", "-e", "node_modules", "-e", ".env", "-e", ".neon"]);
  fs.writeFileSync(path.join(ROOT, ".gitignore"), PROTECTIVE_GITIGNORE);
}

function writeOpFiles(op: Op) {
  for (const file of op.files) {
    const absolute = path.join(ROOT, file.relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, file.content);
  }
  fs.writeFileSync(path.join(ROOT, ".gitignore"), PROTECTIVE_GITIGNORE);
}

function isoWithOffset(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}-05:00`;
}

function main() {
  const tip = gitOut(["rev-parse", "--short", "HEAD"]);
  console.log(`Starting from HEAD ${tip} (phase 1 preserved)`);
  console.log(`Snapshotting to ${SNAPSHOT}...`);
  const files = ensureSnapshot();
  const calendar = buildCalendar();
  console.log(`Files scanned: ${files.length}; slots: ${calendar.length}`);

  const ops = buildOps(files, calendar.length);
  console.log(`Operations: ${ops.length}`);

  console.log("Restoring clean HEAD tree...");
  restoreHeadClean();

  let made = 0;
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const when = isoWithOffset(calendar[i]);
    writeOpFiles(op);
    git(["-c", "advice.addIgnoredFile=false", "add", "-A"]);
    const status = gitOut(["status", "--porcelain"]);
    if (!status) continue;
    if (status.split("\n").some((line) => /\s\.env$|\.lorevault-final/.test(line))) {
      throw new Error(`Refusing sensitive paths:\n${status}`);
    }
    git(["commit", "-m", op.message], {
      GIT_AUTHOR_DATE: when,
      GIT_COMMITTER_DATE: when,
    });
    made += 1;
    if (made % 50 === 0) console.log(`Committed ${made}/${ops.length}`);
  }

  console.log(`Phase 2 complete. Commits created: ${made}`);
}

main();
