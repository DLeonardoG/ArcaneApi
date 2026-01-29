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