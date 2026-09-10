// A hardcoded pool of character archetypes. When the user hits an
// auto-generate button, one of these is picked at random and given to the
// LLM as a concrete seed — without it, the model tends to default to the
// same "most probable" generic character every time.
//
// Built from 50 broad character-type categories (warrior, mage, angel,
// vampire, tech-engineer, jester, etc.) spanning fantasy/sci-fi/mythology,
// each expanded into 5 variants crossed against different domains/elements
// and calm-vs-intense moods, so results stay varied in both genre and tone.

export const ARCHETYPES = [
  // Warrior/Knight
  "stoic ice knight sworn to silence",
  "wrathful crimson-blade war knight",
  "gentle temple knight who never draws first",
  "battle-worn desert knight of a fallen order",
  "radiant sunsteel knight-errant",
  // Barbarian/Berserker
  "frenzied storm-touched berserker",
  "calm giant who only rages to protect kin",
  "bloodthirsty ash-covered wasteland berserker",
  "tribal thunder-axe berserker chief",
  "serene berserker who meditates before battle",
  // Ranger/Hunter
  "quiet frost-tracker with a snow-lynx companion",
  "ruthless bounty-hunting ranger of the badlands",
  "gentle forest ranger who heals wounded beasts",
  "relentless jungle-vine hunter with poison darts",
  "lone desert hunter who reads the wind",
  // Gladiator
  "bloodlust-driven arena gladiator",
  "calm veteran gladiator who spares the weak",
  "savage beast-hybrid arena champion",
  "crowd-loved showman gladiator with trick weapons",
  "grim chained gladiator seeking freedom",
  // Monk/Ascetic
  "serene mountain-top meditating yogi",
  "disciplined ember-fist monk who never speaks",
  "tranquil bamboo forest monk",
  "furious iron-body monk who broke his vows",
  "calm sky-temple monk with wind magic",
  // Rogue/Assassin
  "ruthless shadow bounty hunter",
  "silent poison-blade assassin of the night guild",
  "charming cat-burglar rogue with a code of honor",
  "merciless masked killer-for-hire",
  "quiet rooftop-runner who steals only from tyrants",
  // Mage/Sorcerer
  "calm arcane librarian who hoards forbidden spells",
  "wild lightning-veined battle-sorcerer",
  "gentle candlelight mage who mends broken things",
  "obsessive rune-scarred spellcaster chasing forbidden power",
  "serene star-taught sorcerer of the observatory",
  // Priest/Cleric
  "radiant sun-priestess who heals the dying",
  "grim war-cleric who wields a warhammer",
  "gentle village healer touched by a minor god",
  "zealous plague-ward priest burning the corrupted",
  "calm ancestor-priest who speaks with the dead",
  // Druid
  "serene forest druid who speaks with trees",
  "feral thornback beast-tamer druid",
  "gentle tide-druid who calms storms",
  "wild bramble-cloaked druid who shuns cities",
  "calm root-bound druid elder of an ancient grove",
  // Necromancer
  "savage bone-collector necromancer",
  "cold-blooded undead knight commander",
  "quiet grave-tender who raises only the willing dead",
  "vengeful necromancer seeking to undo their own death",
  "grim crypt-keeper who bargains with restless spirits",
  // Shaman/Witch doctor
  "wrathful storm-caller shaman",
  "gentle bone-charm healer of a nomad tribe",
  "feverish spirit-talker shaman lost in visions",
  "calm ancestral-mask shaman of the swamp",
  "fierce war-paint shaman who channels beast spirits",
  // Summoner/Beast-tamer
  "peaceful shepherd of spirit beasts",
  "ruthless pit-fighter who summons chained demons",
  "gentle egg-keeper who raises baby dragons",
  "frenzied swarm-summoner covered in insect familiars",
  "calm whistling summoner who calls storm-birds",
  // Alchemist/Scholar
  "calm alchemist brewing quiet potions",
  "manic explosive-obsessed potion-slinger",
  "quiet librarian of forbidden tomes",
  "meticulous poison-master alchemist for hire",
  "gentle herbalist-scholar who cures plagues",
  // Angel/Celestial
  "wrathful fallen angel exile",
  "radiant seraph bound to a mortal oath",
  "gentle guardian-angel of a dying star",
  "stern judgment-angel who weighs mortal sins",
  "serene choir-angel who sings the dead to rest",
  // Demon/Infernal
  "savage demon-blooded warlord",
  "charming deal-making imp in noble disguise",
  "wrathful ash-horned pit-fiend",
  "quiet demon exiled for showing mercy",
  "furious chained demon seeking vengeance on its summoner",
  // Elemental spirit
  "gentle healing water spirit",
  "raging molten lava titan",
  "calm glacier spirit keeper",
  "furious thunderbird avatar",
  "serene breeze-born air spirit",
  // Golem/Construct
  "rage-fueled rune-etched war-golem",
  "gentle clockwork nanny-construct",
  "silent sandstone temple guardian golem",
  "furious iron colossus with a cracked core",
  "calm garden-tending moss-golem",
  // Fae/Trickster spirit
  "mischievous forest fae trickster",
  "gentle firefly-winged fae healer",
  "cruel bargain-making fae noble",
  "playful shape-shifting pixie prankster",
  "serene moonlit fae guardian of a sacred glen",
  // Vampire
  "cold aristocratic blood-noble vampire",
  "starving feral vampire shunned by its own kind",
  "calm centuries-old vampire who no longer hunts",
  "vicious plague-blooded vampire spreading corruption",
  "melancholic vampire poet mourning a lost era",
  // Werebeast/Shapeshifter
  "ferocious feral wolf-kin warrior",
  "calm shapeshifter who prefers animal form to human",
  "savage feral boar-rider raider",
  "gentle deer-kin healer of the woodland village",
  "frenzied were-tiger hunter of the jungle",
  // Ghost/Spirit
  "vengeful ghost of a fallen kingdom",
  "gentle nursery-haunting protective spirit",
  "restless battlefield-wandering soldier's ghost",
  "calm ancestral spirit guiding its bloodline",
  "sorrowful drowned-sailor ghost of the coast",
  // Beast/Monster
  "bloodthirsty warbeast of the wastelands",
  "gentle giant moss-covered forest beast",
  "savage many-eyed cave-dwelling monster",
  "calm ancient turtle-beast carrying a village on its shell",
  "feral chimera stitched from three beasts",
  // Bard/Performer
  "charming storm-voiced bard who commands crowds",
  "melancholic traveling musician with a cursed lute",
  "gleeful mask-dancer performer of the carnival",
  "sly rumor-spreading bard-spy",
  "serene lullaby-singer who calms raging beasts",
  // Pirate/Sailor
  "merciless pirate captain of the storm seas",
  "jovial one-legged sea-shanty captain",
  "grim ghost-ship helmsman bound to his wreck",
  "cunning smuggler-sailor of the fog coast",
  "calm old sailor who reads storms in his bones",
  // Nomad/Wanderer
  "calm desert oracle who reads the sand",
  "hardened wasteland nomad guarding a water-caravan",
  "wandering star-map trader of the dunes",
  "solitary ash-plains wanderer fleeing a broken oath",
  "serene dune-walker who speaks to sand-spirits",
  // Royalty/Noble
  "stern exiled queen reclaiming her throne",
  "charming manipulative court noble",
  "gentle child-monarch guided by an ancient advisor",
  "ruthless usurper-prince drunk on power",
  "dignified elder king who chose peace over conquest",
  // Oracle/Seer
  "calm astronomer who charts fate in stars",
  "frantic prophet cursed with visions of doom",
  "serene blind seer who sees only truths, never futures",
  "solemn bone-cast diviner of the tribe",
  "unsettling child-oracle speaking in riddles",
  // Guardian/Sentinel
  "stoic tomb-guardian sworn for a thousand years",
  "gentle threshold-warden of a hidden sanctuary",
  "fierce border-sentinel of a forgotten wall",
  "calm lighthouse-keeper guardian of lost sailors",
  "grim vault-guardian bound to a cursed treasure",
  // Tech-engineer/Machine-rider
  "calm rune-tech engineer fusing magic and machine",
  "reckless mech-rider duelist of the scrapyard arena",
  "meticulous clockmaker who builds tiny spy-automatons",
  "grease-stained airship mechanic with a magnet-arm",
  "visionary inventor building wings for the wingless",
  // Cosmic wanderer
  "serene void-gazing hermit",
  "restless star-fallen wanderer searching for home",
  "calm meteor-rider drifting between worlds",
  "awe-struck nebula-touched pilgrim",
  "quiet astral cartographer mapping unseen realms",
  // Paladin/Holy Knight
  "radiant oath-bound paladin of the dawn",
  "grim paladin who broke their vows for revenge",
  "gentle paladin-healer of a war-torn village",
  "stern paladin-judge who executes the corrupted",
  "serene elder paladin training the next generation",
  // Duelist/Swordmaster
  "elegant rapier-duelist of the noble courts",
  "calm blind swordmaster who fights by sound",
  "reckless glory-seeking duelist challenging all comers",
  "disciplined twin-blade master of a mountain dojo",
  "grim duelist bound to avenge a fallen teacher",
  // Templar/Inquisitor
  "zealous witch-hunting inquisitor",
  "stern templar-commander of a holy order",
  "calm reformed inquisitor seeking redemption",
  "ruthless heresy-burning templar judge",
  "solemn templar-scribe recording the order's sins",
  // Executioner
  "grim silent executioner who mourns each death",
  "cold masked headsman of the capital",
  "calm retired executioner turned gravedigger",
  "merciless plague-executioner who burns the infected",
  "stoic executioner-monk bound by a sacred duty",
  // Outlaw/Raider
  "cunning wasteland outlaw leading a ragtag gang",
  "vengeful ex-soldier turned highway raider",
  "calm reformed bandit-chief protecting a hidden village",
  "ruthless dune-raider who strikes at dawn",
  "reckless young outlaw chasing a legendary heist",
  // Warlock
  "wrathful pact-bound warlock serving a dark patron",
  "calm warlock quietly plotting to break their pact",
  "desperate warlock who traded their voice for power",
  "unsettling warlock whose shadow moves on its own",
  "serene warlock bound to a gentle star-patron",
  // Witch
  "vicious swamp witch with a grudge",
  "gentle hedge-witch who brews village remedies",
  "solitary bog-witch cursed to never age",
  "wrathful storm-witch who drowned her enemies' fleet",
  "calm moon-witch reading omens in silver light",
  // Illusionist/Mind-mage
  "sly mirror-mage who fights with illusions",
  "calm dream-walker who enters others' nightmares",
  "unsettling mind-bender who erases memories",
  "charming stage-illusionist hiding real magic",
  "serene mirage-monk of the endless desert",
  // Chronomancer
  "calm time-worn chronomancer aging backwards",
  "frantic chronomancer trying to undo a single moment",
  "serene hourglass-keeper who guards a frozen village",
  "reckless time-thief stealing minutes from the wealthy",
  "grim chronomancer haunted by futures they've already seen",
  // Puppeteer/Marionette-mage
  "unsettling puppeteer who controls the fallen in battle",
  "calm string-mage who animates wooden toys for children",
  "sinister marionette-lord ruling a court of puppets",
  "quiet puppeteer mourning the marionette she lost",
  "eerie shadow-puppeteer performing tales of doom",
  // Blacksmith/Runesmith
  "calm rune-smith forging blades that remember their wielders",
  "gruff mountain blacksmith who never leaves his forge",
  "meticulous armor-smith crafting for fallen kings",
  "fiery forge-master who tempers steel with dragon's breath",
  "gentle village smith secretly a legendary weaponsmith",
  // Merchant/Trader-schemer
  "charming caravan-merchant who trades in secrets",
  "ruthless black-market broker of rare relics",
  "calm tea-house merchant who quietly funds rebellions",
  "cunning spice-road trader playing all sides",
  "jovial fortune-telling merchant selling false hope",
  // Relic-hunter/Archaeologist
  "reckless tomb-raiding relic hunter",
  "calm scholar-explorer cataloguing lost civilizations",
  "grim relic-hunter cursed by their own discovery",
  "eager young archaeologist chasing a family legend",
  "solitary desert-ruins excavator who talks to ghosts",
  // Miner/Earth-delver
  "gruff deep-earth miner who hears the mountain's voice",
  "calm gem-touched miner who can taste ore in the dark",
  "desperate miner fleeing a collapsed tunnel's curse",
  "stoic dwarven-blooded delver of ancient mine-cities",
  "cheerful crystal-miner who befriends cave creatures",
  // Plague-bearer
  "grim plague-doctor spreading a cure that corrupts",
  "silent plague-bearer who cannot feel their own decay",
  "vengeful plague-spirit born from a forgotten famine",
  "calm quarantine-healer immune to their own affliction",
  "unsettling child untouched by the plague they carry",
  // Abyss-walker
  "calm deep-sea diver who speaks with abyssal things",
  "pressure-scarred abyss-walker who never surfaces",
  "serene bioluminescent trench-wanderer",
  "grim abyss-cultist who worships the crushing dark",
  "fearless void-diver mapping the ocean's bottomless trench",
  // Cave-dweller
  "blind subterranean survivalist who sees through sound",
  "calm bioluminescent cave-hermit",
  "feral cave-dweller raised by underground beasts",
  "quiet crystal-cavern recluse who hasn't seen sunlight in years",
  "wary tunnel-scout guiding travelers through the dark",
  // Sky-sailor/Airship captain
  "bold airship captain of a cloud-piercing vessel",
  "calm cartographer-sailor charting unseen sky currents",
  "reckless storm-chasing sky-pirate",
  "gentle balloon-merchant selling wares between floating isles",
  "stoic sky-sailor searching for a lost fleet",
  // Beastmaster/Warden
  "calm warden bonded to a wounded dire-wolf",
  "gentle sanctuary-keeper of injured spirit beasts",
  "fierce beastmaster who rides a war-griffin",
  "quiet warden raising an orphaned dragon in secret",
  "serene shepherd of migrating storm-birds",
  // Jester/Fool
  "gleeful court jester hiding a spymaster's mind",
  "melancholic fool who jests to hide a broken heart",
  "sly carnival trickster who always wins the game",
  "unsettling silent jester who only mimes",
  "wise wandering fool who speaks truths no noble dares say",
];

export function randomArchetype() {
  return ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
}
