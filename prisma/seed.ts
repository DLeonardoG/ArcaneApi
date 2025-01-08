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
    update: {},
    create: {
      email: "admin@lorevault.app",
      name: "LoreVault Admin",
      passwordHash,
      role: "ADMIN",
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

  for (const universe of [arcaneUniverse, ...placeholderUniverses]) {
    await prisma.universe.upsert({
      where: { slug: universe.slug },
      update: {
        name: universe.name,
        tagline: universe.tagline,
        description: universe.description,
        accent: universe.accent,
        isFeatured: universe.isFeatured,
      },
      create: universe,
    });
  }

  const arcane = await prisma.universe.findUniqueOrThrow({
    where: { slug: "arcane" },
  });

  for (const faction of arcaneFactions) {
    await prisma.faction.upsert({
      where: {
        universeId_slug: { universeId: arcane.id, slug: faction.slug },
      },