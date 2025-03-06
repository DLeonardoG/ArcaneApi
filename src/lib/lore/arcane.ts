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
    summary: "Time, hope, and hoverboards against the chem empire.",
    bio: "Ekko builds futures in scrap yards. The Firelights are his answer to a city that keeps telling kids they have none.",
    allegiances: ["Firelights", "Zaun"],
    imageHint: "hoverboard chronobreak",
  },
  {
    slug: "vander",
    name: "Vander",
    title: "Hound of the Underground",
    summary: "Peacemaker of the lanes, father by choice.",
    bio: "Vander chooses restraint after blood. His protection becomes a cage Silco refuses to live inside — and the sisters inherit the fallout.",
    allegiances: ["Zaun", "The Last Drop"],
    imageHint: "bar keeper protector",
  },
  {
    slug: "mel",
    name: "Mel Medarda",
    title: "The diplomat",
    summary: "Noxian ambition wrapped in Piltover gold.",
    bio: "Mel plays council chess with empire-trained instincts. Affection complicates strategy; strategy never fully leaves the room.",
    allegiances: ["Piltover Council", "Medarda"],
    imageHint: "gold tattoos council",
  },
];

export const arcaneEpisodes = [
  {
    slug: "s1e1-welcome-to-the-playground",
    title: "Welcome to the Playground",
    season: 1,
    number: 1,
    synopsis: "Sisters scrape by in Zaun until a heist lights the fuse of hextech destiny.",
    airDate: "2021-11-06",
  },
  {
    slug: "s1e2-some-mysteries-are-better-left-unsolved",
    title: "Some Mysteries Are Better Left Unsolved",
    season: 1,
    number: 2,
    synopsis: "Piltover investigates; Zaun mourns. Grayson and Vander try to hold a fragile peace.",
    airDate: "2021-11-06",
  },
  {
    slug: "s1e3-the-base-violence-necessary-for-change",
    title: "The Base Violence Necessary for Change",
    season: 1,
    number: 3,
    synopsis: "A bridge burns. Powder becomes something else, and Silco claims a daughter.",
    airDate: "2021-11-06",
  },
  {
    slug: "s1e4-happy-progress-day",
    title: "Happy Progress Day!",
    season: 1,
    number: 4,
    synopsis: "Years later, Progress Day glitter hides undercity war and a sister's return.",
    airDate: "2021-11-13",
  },
  {
    slug: "s1e5-everybody-wants-to-be-my-enemy",
    title: "Everybody Wants to Be My Enemy",
    season: 1,
    number: 5,
    synopsis: "Vi and Caitlyn descend into Zaun while Jinx unravels at the seams.",
    airDate: "2021-11-13",
  },
  {
    slug: "s1e6-when-these-walls-come-tumbling-down",
    title: "When These Walls Come Tumbling Down",
    season: 1,
    number: 6,
    synopsis: "Alliances crack. Firelights clash. The tea party of nightmares begins.",
    airDate: "2021-11-13",
  },
  {
    slug: "s1e7-the-boy-savior",
    title: "The Boy Savior",
    season: 1,
    number: 7,
    synopsis: "Ekko's gambit and Jayce's politics force everyone onto collision courses.",
    airDate: "2021-11-20",
  },
  {
    slug: "s1e8-oil-and-water",
    title: "Oil and Water",
    season: 1,
    number: 8,
    synopsis: "Council votes and family ghosts collide as Silco's nation edges closer.",
    airDate: "2021-11-20",
  },
  {
    slug: "s1e9-the-monster-you-created",
    title: "The Monster You Created",
    season: 1,
    number: 9,
    synopsis: "A rocket draws a new skyline. Piltover learns what Zaun has always known.",
    airDate: "2021-11-20",
  },
  {
    slug: "s2e1-heavy-is-the-crown",
    title: "Heavy Is the Crown",
    season: 2,
    number: 1,
    synopsis: "Aftermath politics, rage, and the cost of a city split in half.",
    airDate: "2024-11-09",
  },
  {
    slug: "s2e2-watch-it-all-burn",
    title: "Watch It All Burn",
    season: 2,
    number: 2,
    synopsis: "Retaliation ripples through both cities as old mentors return changed.",
    airDate: "2024-11-09",
  },
  {
    slug: "s2e3-finally-got-the-name-right",
    title: "Finally Got the Name Right",
    season: 2,
    number: 3,
    synopsis: "Identity, invention, and the thin line between weapon and wonder.",
    airDate: "2024-11-09",
  },
];

export const arcaneArticles = [
  {
    slug: "hextech-and-power",
    title: "Hextech and Power",
    summary: "How crystals rewrite class, war, and storytelling in Arcane.",
    body: `## Hextech as metaphor\n\nHextech is not only a plot device — it is the show's argument about progress. Who patents the future? Who breathes the fumes of its manufacture?\n\n## Fans keep score\n\nLoreVault tracks inventions, council votes, and undercity counter-tech so fans can argue timelines with receipts.`,
  },
  {
    slug: "sisters-of-zaun",
    title: "Sisters of Zaun",
    summary: "Powder and Vi as the emotional spine of the saga.",
    body: `## Two cities, one wound\n\nEvery political subplot orbits a childhood promise broken on a bridge.\n\n## Reading the symbols\n\nMonkeys, firelights, pink and blue — the visual language never lets the sisters leave the frame, even when they are apart.`,
  },
];
