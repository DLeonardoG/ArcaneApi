import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  arcaneArticles,
  arcaneCharacters,
  arcaneEpisodes,
  arcaneFactions,
  arcaneLocations,
  arcaneUniverse,
  placeholderUniverses,
} from "../src/lib/lore/arcane";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("lorevault123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lorevault.app" },
    update: { role: "SUPER_ADMIN" },
    create: {
      email: "admin@lorevault.app",
      name: "LoreVault Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@lorevault.app" },
    update: {},
    create: {
      email: "editor@lorevault.app",
      name: "Arcane Archivist",
      passwordHash,
      role: "EDITOR",
    },
  });

  await prisma.user.upsert({
    where: { email: "fan@lorevault.app" },
    update: {},
    create: {
      email: "fan@lorevault.app",
      name: "Zaun Fan",
      passwordHash,
      role: "USER",
    },
  });

  for (const universe of [arcaneUniverse, ...placeholderUniverses]) {
    await prisma.universe.upsert({
      where: { slug: universe.slug },
      update: {