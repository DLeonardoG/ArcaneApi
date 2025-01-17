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

function buildOps(files: string[], slotCount: number): Op[] {
  const ops: Op[] = [];
  const perFile = Math.max(1, Math.ceil(slotCount / Math.max(files.length, 1)));

  for (const relative of files) {
    const absolute = path.join(SNAPSHOT, relative);
    const content = fs.readFileSync(absolute);
    const chunks = chunkBuffer(content, Math.min(perFile, 4));
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
    const note = "docs/changelog-sim.md";
    const prev =
      ops
        .slice()
        .reverse()
        .find((op) => op.files.some((f) => f.relative === note))
        ?.files.find((f) => f.relative === note)
        ?.content.toString("utf8") ?? "# LoreVault simulated changelog\n\n";
    ops.push({
      message: "",
      files: [
        {
          relative: note,
          content: Buffer.from(`${prev}- polish pass ${pad}\n`, "utf8"),
        },
      ],
    });
  }

  if (ops.length > slotCount) {
    const head = ops.slice(0, slotCount - 1);
    const tail = ops.slice(slotCount - 1);
    const mergedFiles = new Map<string, Buffer>();
    for (const op of tail) {
      for (const file of op.files) {
        mergedFiles.set(file.relative, file.content);
      }
    }
    head.push({
      message: "",
      files: [...mergedFiles.entries()].map(([relative, content]) => ({
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

function ensureCleanSnapshot() {
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

function wipeTrackedExceptGit() {
  for (const entry of fs.readdirSync(ROOT)) {
    if (
      entry === ".git" ||
      entry === "node_modules" ||
      entry === ".env"
    ) {
      continue;
    }
    fs.rmSync(path.join(ROOT, entry), { recursive: true, force: true });
  }
}

function writeOpFiles(op: Op) {
  for (const file of op.files) {
    const absolute = path.join(ROOT, file.relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, file.content);
  }
  // Keep ignore rules authoritative after every write
  fs.writeFileSync(path.join(ROOT, ".gitignore"), PROTECTIVE_GITIGNORE);
}

function isoWithOffset(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}-05:00`;
}

function main() {
  const first = gitOut(["rev-list", "--max-parents=0", "HEAD"]);
  console.log(`Root commit: ${first}`);
  console.log(`Snapshotting final tree to ${SNAPSHOT}...`);
  const files = ensureCleanSnapshot();
  const calendar = buildCalendar();
  console.log(`Files: ${files.length}; commit slots: ${calendar.length}`);

  const ops = buildOps(files, calendar.length);
  console.log(`Operations prepared: ${ops.length}`);

  console.log("Resetting to root commit...");
  git(["reset", "--hard", first]);
  wipeTrackedExceptGit();
  fs.writeFileSync(path.join(ROOT, ".gitignore"), PROTECTIVE_GITIGNORE);

  let made = 0;
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const when = isoWithOffset(calendar[i]);
    writeOpFiles(op);
    git(["-c", "advice.addIgnoredFile=false", "add", "-A"]);
    const status = gitOut(["status", "--porcelain"]);
    if (!status) {
      continue;
    }
    // Safety: never commit secrets or snapshot dirs
    if (status.includes(".env\n") || status.includes(".lorevault-final")) {
      throw new Error(`Refusing to commit sensitive/ignored paths:\n${status}`);
    }
    git(["commit", "-m", op.message], {
      GIT_AUTHOR_DATE: when,
      GIT_COMMITTER_DATE: when,
    });
    made += 1;
    if (made % 50 === 0) {
      console.log(`Committed ${made}/${ops.length}`);
    }
  }

  console.log(`History build complete. Commits created: ${made}`);
  console.log("Re-install if needed: pnpm install");
}

main();
