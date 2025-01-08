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