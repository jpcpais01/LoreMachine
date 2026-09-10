// A hardcoded pool of character archetypes. When the user hits an
// auto-generate button, one of these is picked at random and given to the
// LLM as a concrete seed — without it, the model tends to default to the
// same "most probable" generic character every time.
//
// Deliberately spans far beyond sci-fi/tech (magic, nature, divine,
// undead, fae, beasts, elements...) and mixes calm/serene entries with
// intense/violent ones so auto-generated characters don't all land in the
// same mood.

export const ARCHETYPES = [
  "serene forest druid who speaks with trees",
  "wrathful volcanic berserker",
  "gentle healing water spirit",
  "ruthless shadow bounty hunter",
  "wise old mountain hermit sage",
  "bloodthirsty warbeast of the wastelands",
  "calm celestial star-reader monk",
  "ferocious feral wolf-kin warrior",
  "tranquil lotus pond healer",
  "savage demon-blooded warlord",
  "mischievous forest fae trickster",
  "stoic ice knight sworn to silence",
  "frenzied storm-touched berserker",
  "peaceful elder tree guardian",
  "vicious swamp witch with a grudge",
  "serene sky temple monk",
  "raging molten lava titan",
  "gentle firefly-winged fae healer",
  "cold-blooded undead knight commander",
  "calm desert oracle who reads the sand",
  "furious thunderbird avatar",
  "quiet cave-dwelling crystal sage",
  "bloodlust-driven arena gladiator",
  "peaceful shepherd of spirit beasts",
  "wrathful fallen angel exile",
  "serene koi-pond water dancer",
  "savage feral boar-rider raider",
  "calm astronomer who charts fate in stars",
  "rage-fueled rune-etched war-golem",
  "gentle moth-winged night healer",
  "merciless pirate captain of the storm seas",
  "tranquil bamboo forest monk",
  "feral thornback beast-tamer",
  "serene glacier spirit keeper",
  "bloodthirsty jungle huntress",
  "calm alchemist brewing quiet potions",
  "furious volcanic phoenix reborn",
  "peaceful mushroom-grove gardener",
  "vengeful ghost of a fallen kingdom",
  "gentle whale-song ocean singer",
  "savage bone-collector necromancer",
  "serene mountain-top meditating yogi",
  "wrathful storm-caller shaman",
  "calm librarian of forbidden tomes",
  "feral saber-tooth beast rider",
  "tranquil rain-dance priestess",
  "bloodthirsty gladiator-beast hybrid",
  "peaceful firefly meadow keeper",
  "ferocious dragon-blooded knight",
  "serene void-gazing hermit",
];

export function randomArchetype() {
  return ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
}
