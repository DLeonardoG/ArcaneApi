export const arcaneUniverse = {
  slug: "arcane",
  name: "Arcane",
  tagline: "The undercity and the city of progress",
  description:
    "A fan chronicle of Piltover and Zaun: sisters divided by ambition, hextech discovery, and a war that remakes both cities. LoreVault marks this as the founding saga of the archive.",
  accent: "#7dd3c0",
  isFeatured: true,
};

export const placeholderUniverses = [
  {
    slug: "starfall-chronicles",
    name: "Starfall Chronicles",
    tagline: "Placeholder saga — coming soon",
    description:
      "An empty vault reserved for a space-opera fandom. Add characters, arcs, and articles when you are ready.",
    accent: "#8b9cff",
    isFeatured: false,
  },
  {
    slug: "ember-realms",
    name: "Ember Realms",
    tagline: "Placeholder saga — coming soon",
    description:
      "A high-fantasy shelf waiting for factions, maps, and myth. Seed it from the editor when lore lands.",
    accent: "#e07a5f",
    isFeatured: false,
  },
];

export const arcaneFactions = [
  {
    slug: "piltover-council",
    name: "Piltover Council",
    summary: "Merchant aristocracy steering the City of Progress.",
    description:
      "The Council balances trade, hextech patents, and public order. Idealism clashes with oligarchic instinct whenever Zaun demands air and dignity.",
  },
  {
    slug: "chem-barons",
    name: "Chem-Barons",
    summary: "Crime lords of Zaun who monetize shimmer and despair.",
    description:
      "They carve the undercity into markets of addiction and muscle. Alliances shift as quickly as the fumes above the lanes.",
  },
  {
    slug: "firelights",
    name: "Firelights",
    summary: "Hoverboard rebels fighting shimmer and hopelessness.",
    description:
      "Led by ideals more than territory, the Firelights strike chem dens and protect what remains of Zaun's future.",
  },
];

export const arcaneLocations = [
  {
    slug: "piltover",
    name: "Piltover",
    region: "Upper city",
    summary: "Bridges, academies, and hexgates of gleaming ambition.",
    description:
      "Piltover sells progress as destiny. Its towers drink the labor of Zaun while celebrating invention as moral proof.",
  },
  {
    slug: "zaun",
    name: "Zaun",
    region: "Undercity",
    summary: "Lane markets, chem-labs, and lungs full of neon fog.",
    description:
      "Zaun invents out of necessity. Beauty and brutality share the same alley; every shortcut has a body count.",
  },
  {
    slug: "the-hexgates",
    name: "The Hexgates",
    region: "Piltover",
    summary: "Global trade arteries powered by unstable brilliance.",
    description:
      "Jayce's breakthrough becomes the city's heartbeat and its greatest vulnerability — a monument to progress that never asks who pays.",
  },
  {
    slug: "the-last-drop",
    name: "The Last Drop",
    region: "Zaun",
    summary: "Vander's bar, later Silco's throne room in disguise.",
    description:
      "A family hearth twisted into a war room. The Last Drop remembers every toast that turned into a threat.",
  },
];

export const arcaneCharacters = [
  {
    slug: "jinx",
    name: "Jinx",
    title: "The loose cannon",
    summary: "Powder remade by grief into chaos with a smile.",
    bio: "Sister, saboteur, and living reminder that Piltover's progress leaves corpses in the lanes. Her genius is improvisation; her tragedy is never being allowed to stop.",
    allegiances: ["Zaun", "Silco"],
    imageHint: "blue braids neon chaos",
  },
  {
    slug: "vi",
    name: "Vi",
    title: "The piltover enforcer",
    summary: "Fists first, heart buried under gauntlets.",
    bio: "Raised in Zaun, weaponized by Piltover. Vi hunts justice with knuckle-dusted certainty and a sister-shaped wound that never closes.",
    allegiances: ["Piltover Enforcers", "Zaun"],
    imageHint: "pink hair gauntlets",
  },
  {
    slug: "jayce",
    name: "Jayce Talis",
    title: "Man of Progress",
    summary: "Inventor turned councilor, hextech's golden face.",
    bio: "Jayce wants a better world and keeps discovering that better for whom is the real equation. Ambition, love, and politics forge him into a reluctant weapon.",
    allegiances: ["Piltover Council", "Hextech"],
    imageHint: "councilor hammer",
  },
  {
    slug: "caitlyn",
    name: "Caitlyn Kiramman",
    title: "Sheriff of Piltover",
    summary: "Precision, privilege, and a conscience under pressure.",
    bio: "Caitlyn aims for truth through a scope. Her city's rot forces her to choose between inheritance and justice measured in more than arrests.",
    allegiances: ["Piltover Enforcers", "Kiramman"],
    imageHint: "rifle cupola",
  },
  {
    slug: "silco",
    name: "Silco",
    title: "The Eye of Zaun",
    summary: "Nation-builder who loves Zaun more than peace.",
    bio: "Silco turns trauma into doctrine. He will burn the old order to birth a free Zaun — even if freedom arrives soaked in shimmer.",
    allegiances: ["Chem-Barons", "Zaun"],
    imageHint: "scarred eye office",
  },
  {
    slug: "ekko",
    name: "Ekko",
    title: "Boy Savior",