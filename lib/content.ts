// ---------------------------------------------------------------------------
// Central content catalogue for Wilpattu Wilds.
// All photography is hot-linked from Unsplash (free licence) — every URL in
// this file was verified to return HTTP 200.
// ---------------------------------------------------------------------------

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export interface Photo {
  src: string;
  alt: string;
  tag?: string;
}

/* ----------------------------------- Hero ---------------------------------- */

export const heroImages = {
  safari: u("photo-1516426122078-c23e76319801", 2000),
  jungle: u("photo-1502580969434-4550a9e56735", 2000),
  villu: u("photo-1770851972315-b52ec9a4cda8", 2000),
  lodge: u("photo-1605538032432-a9f0c8d9baac", 2000),
  dining: u("photo-1742281095650-dd3c50c08772", 2000),
};

/* --------------------------------- Wildlife -------------------------------- */

export const wildlife: (Photo & { name: string; blurb: string })[] = [
  {
    name: "Sri Lankan Leopard",
    tag: "Panthera pardus kotiya",
    src: u("photo-1661768508643-e260f6f8e06c"),
    alt: "Sri Lankan leopard walking along a dirt track in Wilpattu National Park",
    blurb:
      "Wilpattu is one of the best places on Earth to see the elusive Sri Lankan leopard — the island's apex predator — patrolling shaded forest roads at dawn.",
  },
  {
    name: "Sloth Bear",
    tag: "Melursus ursinus",
    src: u("photo-1779111370141-4cc5d671be58"),
    alt: "Sloth bear standing amidst green foliage",
    blurb:
      "Shaggy, honey-loving and wonderfully odd, sloth bears emerge in June–July when the palu trees fruit. Wilpattu is their stronghold in Sri Lanka.",
  },
  {
    name: "Asian Elephant",
    tag: "Elephas maximus",
    src: u("photo-1533484482814-3fe2d922be89"),
    alt: "Asian elephants bathing in a waterhole at daytime",
    blurb:
      "Lone tuskers and small herds drift between the villus, wallowing in the shallows during the heat of the day.",
  },
  {
    name: "Indian Peafowl",
    tag: "Pavo cristatus",
    src: u("photo-1548148491-90655471726c"),
    alt: "Peacock displaying blue and green plumage on grassland",
    blurb:
      "The jungle's alarm clock. Peacocks dance on every open glade — one of nearly 200 bird species recorded inside the park.",
  },
  {
    name: "Mugger Crocodile",
    tag: "Crocodylus palustris",
    src: u("photo-1620050825606-d8c952569ea0"),
    alt: "Mugger crocodile floating in still water",
    blurb:
      "Ancient sentinels of the villus. Muggers bask motionless on the lake edges while painted storks wade past.",
  },
  {
    name: "Spotted Deer",
    tag: "Axis axis ceylonensis",
    src: u("photo-1706459671567-43529d418cd1"),
    alt: "Herd of spotted deer standing on dry grassland",
    blurb:
      "Great herds of chital graze the open sand plains — and where the deer are nervous, a leopard is rarely far away.",
  },
];

/* ------------------------------ Safari packages ---------------------------- */

export interface SafariPackage {
  id: string;
  name: string;
  time: string;
  duration: string;
  priceUSD: number;
  per: string;
  photo: Photo;
  highlights: string[];
  description: string;
  popular?: boolean;
}

export const safariPackages: SafariPackage[] = [
  {
    id: "morning",
    name: "Dawn Patrol",
    time: "5:45 AM – 10:30 AM",
    duration: "Half day · Morning",
    priceUSD: 65,
    per: "per person",
    photo: {
      src: u("photo-1677741446379-8afb81b8e9d1"),
      alt: "Safari jeep driving down a dirt road through the forest at dawn",
    },
    highlights: [
      "Best window for leopard sightings",
      "Sunrise over Kudiramalai coast road",
      "Hot Ceylon tea & jungle breakfast stop",
    ],
    description:
      "Enter the gates as they open and follow fresh pug-marks down misty forest corridors. Mornings are when Wilpattu's leopards own the roads.",
    popular: true,
  },
  {
    id: "evening",
    name: "Golden Hour",
    time: "2:00 PM – 6:30 PM",
    duration: "Half day · Evening",
    priceUSD: 65,
    per: "per person",
    photo: {
      src: u("photo-1534476478164-b15fec4f091c"),
      alt: "Silhouette of a safari vehicle under an orange sunset sky",
    },
    highlights: [
      "Elephants gathering at the villus",
      "Sloth bears on palu-fruit season evenings",
      "Sundown over Kumbuk Vila",
    ],
    description:
      "As the heat breaks, the park wakes a second time. Watch herds descend to the water and drive home under a flame-orange sky.",
  },
  {
    id: "fullday",
    name: "Full-Day Expedition",
    time: "5:45 AM – 6:30 PM",
    duration: "Full day · Picnic lunch",
    priceUSD: 145,
    per: "per person",
    photo: {
      src: u("photo-1542085215-673021bf5caa"),
      alt: "Leopard walking between green safari vehicles on a park road",
    },
    highlights: [
      "Deep-park sectors most jeeps never reach",
      "Rice & curry picnic beside Panikka Vila",
      "Dedicated wildlife-photographer guide",
    ],
    description:
      "The connoisseur's safari. Twelve hours inside the park, reaching the remote western villus and the old Kudiramalai lighthouse coast.",
    popular: true,
  },
  {
    id: "overnight",
    name: "Wilds Overnighter",
    time: "2 days · 1 night",
    duration: "Safari + luxury tented camp",
    priceUSD: 320,
    per: "per person",
    photo: {
      src: u("photo-1725280894654-0b3dcad57df3"),
      alt: "Large safari tent set up among tall forest trees",
    },
    highlights: [
      "Evening + dawn game drives",
      "Campfire BBQ under the stars",
      "Night soundscape of the dry-zone jungle",
    ],
    description:
      "Fall asleep to nightjars and wake to a leopard's sawing call. Our tented camp on the park border is the closest you can sleep to the wild.",
  },
];

export const jeepFeatures = [
  { title: "Custom Land Cruisers", text: "Raised 4×4 jeeps with unobstructed 360° viewing, charging ports and bean-bag camera rests." },
  { title: "Naturalist Trackers", text: "Every drive is led by a licensed tracker with 10+ years reading Wilpattu's roads and pug-marks." },
  { title: "Small Groups Only", text: "Maximum six guests per jeep — window seats for everyone, always." },
  { title: "Park Fees Included", text: "All DWC entrance tickets, vehicle permits and taxes are covered in the price." },
];

/* ---------------------------------- Rooms ---------------------------------- */

export interface Room {
  id: string;
  name: string;
  priceUSD: number;
  size: string;
  occupancy: string;
  photo: Photo;
  gallery: Photo[];
  amenities: string[];
  description: string;
}

export const rooms: Room[] = [
  {
    id: "villu-suite",
    name: "Villu Suite",
    priceUSD: 240,
    size: "68 m²",
    occupancy: "2 adults + 1 child",
    photo: {
      src: u("photo-1774280954999-9758f11f3d41"),
      alt: "Cozy suite bedroom with a large window overlooking lush greenery",
    },
    gallery: [
      { src: u("photo-1774280954999-9758f11f3d41"), alt: "Villu Suite bedroom with jungle-view window" },
      { src: u("photo-1582719478250-c89cae4dc85b"), alt: "White linen bed with a carved wooden frame" },
    ],
    amenities: ["Private plunge pool", "Jungle-view rain shower", "King four-poster bed", "Sunset deck"],
    description:
      "Our signature suite floats over the treeline with a private deck facing the waterhole — watch deer come to drink from your plunge pool.",
  },
  {
    id: "jungle-villa",
    name: "Jungle Villa",
    priceUSD: 180,
    size: "52 m²",
    occupancy: "2 adults",
    photo: {
      src: u("photo-1731336478850-6bce7235e320"),
      alt: "Villa bedroom with a white bed and warm wooden headboard",
    },
    gallery: [
      { src: u("photo-1731336478850-6bce7235e320"), alt: "Jungle Villa bedroom interior" },
      { src: u("photo-1662841540530-2f04bb3291e8"), alt: "Villa bedroom with a large bed and ceiling fan" },
    ],
    amenities: ["Outdoor stone bathtub", "Veranda with daybed", "Handloom interiors", "A/C + ceiling fans"],
    description:
      "Timber, thatch and stone villas scattered through old cashew forest, each hidden from the next by a curtain of green.",
  },
  {
    id: "safari-tent",
    name: "Luxury Safari Tent",
    priceUSD: 120,
    size: "38 m²",
    occupancy: "2 adults",
    photo: {
      src: u("photo-1725280894654-0b3dcad57df3"),
      alt: "Luxury safari tent pitched among tall trees",
    },
    gallery: [
      { src: u("photo-1725280894654-0b3dcad57df3"), alt: "Safari tent exterior among the trees" },
      { src: u("photo-1655298614846-1ca9a58b12c1"), alt: "Group of safari tents in a forest clearing" },
    ],
    amenities: ["En-suite hot shower", "Solar lanterns", "Campfire circle", "Wake-up safari calls"],
    description:
      "Canvas walls are all that separate you from the night chorus. Falling asleep here is the whole point of coming.",
  },
  {
    id: "family-bungalow",
    name: "Family Bungalow",
    priceUSD: 210,
    size: "84 m²",
    occupancy: "4 adults + 2 children",
    photo: {
      src: u("photo-1611892440504-42a792e24d32"),
      alt: "Spacious bungalow bedroom with twin seating and warm lighting",
    },
    gallery: [
      { src: u("photo-1611892440504-42a792e24d32"), alt: "Family bungalow master bedroom" },
      { src: u("photo-1605538032432-a9f0c8d9baac"), alt: "Wooden bungalow surrounded by palm trees" },
    ],
    amenities: ["Two bedrooms + loft", "Private garden", "Kids' ranger programme", "Butler pantry"],
    description:
      "A whole timber homestead under the palu trees — built for three generations to share one campfire.",
  },
];

export const lodgeAmenities = [
  { title: "Villu-Edge Pool", text: "A 20-metre infinity pool dissolving into the waterhole below.", src: u("photo-1571896349842-33c89424de2d"), alt: "Blue outdoor infinity pool at dusk" },
  { title: "Open-Air Restaurant", text: "Fire-cooked Sri Lankan food under a nine-metre thatched roof.", src: u("photo-1549294413-26f195200c16"), alt: "Wooden lounge chairs beside a pool surrounded by palm trees" },
  { title: "Spa Under the Trees", text: "Ayurvedic treatments in a pavilion above the forest floor.", src: u("photo-1610641818989-c2051b5e2cfd"), alt: "Palm trees beside a resort swimming pool" },
  { title: "Observation Deck", text: "A canopy-level deck with scopes for birding and stargazing.", src: u("photo-1583037189850-1921ae7c6c22"), alt: "Swimming pool near green trees at a jungle resort" },
];

/* --------------------------------- Dining ---------------------------------- */

export interface Dish {
  name: string;
  desc: string;
  price: string;
}

export const diningExperiences = [
  {
    title: "The Villu Table",
    subtitle: "Signature rice & curry",
    src: u("photo-1742281095650-dd3c50c08772"),
    alt: "Traditional Sri Lankan meal served on a lotus leaf",
    text: "Twelve village curries served on a lotus leaf — jackfruit, lotus root, wild mango, lagoon crab — exactly as the Wanniyala villages have cooked them for generations.",
  },
  {
    title: "Boma Fire Nights",
    subtitle: "Open-fire BBQ",
    src: u("photo-1743525700011-afac212694d7"),
    alt: "A spread of appetizing Sri Lankan curry dishes",
    text: "Every Friday the courtyard fire pit is lit: spiced meats, wood-roasted vegetables and hoppers made to order under the stars.",
  },
  {
    title: "Jungle Breakfast",
    subtitle: "Post-safari feast",
    src: u("photo-1742281095661-29de44440bb6"),
    alt: "Sri Lankan breakfast platters with hoppers and sambols",
    text: "Return from your dawn drive to egg hoppers, kithul-treacle curd, pol sambol and fruit cut minutes before it hits the table.",
  },
  {
    title: "Ceylon Tea Ceremony",
    subtitle: "Highland ritual, lowland view",
    src: u("photo-1709926701984-f5ae0099595f"),
    alt: "Ceylon tea being poured into a cup at a garden table",
    text: "A golden-hour tasting of single-estate Ceylon teas on the observation deck, paired with love-cake and jaggery sweets.",
  },
];

export const menu: { section: string; items: Dish[] }[] = [
  {
    section: "From the Clay Pot",
    items: [
      { name: "Wild Boar Black Curry", desc: "Slow-cooked in roasted Jaffna spice, goraka & coconut", price: "$14" },
      { name: "Lagoon Crab Kari", desc: "Puttalam lagoon crab, murunga leaves, thick coconut milk", price: "$18" },
      { name: "Jackfruit Polos Curry", desc: "Young jackfruit, cinnamon bark, hand-scraped coconut", price: "$9" },
      { name: "Villu Lotus Root Mallung", desc: "Lotus root, turmeric, grated coconut & lime", price: "$7" },
    ],
  },
  {
    section: "From the Fire",
    items: [
      { name: "Boma Spiced Chicken", desc: "Whole spatchcock, tamarind glaze, charred over palu wood", price: "$16" },
      { name: "Negombo Prawn Skewers", desc: "Curry-leaf butter, kochchi chilli, lime", price: "$15" },
      { name: "Egg Hoppers (3)", desc: "Crisp-edged bowls with lunu miris & seeni sambol", price: "$6" },
      { name: "Pol Roti & Katta Sambol", desc: "Coconut flatbread off the flat iron, village-hot relish", price: "$5" },
    ],
  },
  {
    section: "Drinks of the Dry Zone",
    items: [
      { name: "King Coconut, Machete-Opened", desc: "Thambili straight from our grove, served in the husk", price: "$3" },
      { name: "Arrack Old Fashioned", desc: "Ceylon coconut arrack, kithul treacle, bitters", price: "$9" },
      { name: "Villu Sunset", desc: "Passionfruit, lime leaf, soda — with or without arrack", price: "$7" },
      { name: "Single-Estate Ceylon Tea", desc: "Rotating highland estates, brewed to order", price: "$4" },
    ],
  },
];

export const drinkImages: Photo[] = [
  { src: u("photo-1596097092650-730ba9475ad5"), alt: "Fresh king coconut drink on a wooden table" },
  { src: u("photo-1618799805265-4f27cb61ede9"), alt: "Cocktail with an orange slice served on a green leaf" },
  { src: u("photo-1598994392980-53a7fb033bcc"), alt: "Golden arrack cocktail in a coupe glass" },
  { src: u("photo-1625321643320-5321f48312b2"), alt: "Fresh passionfruit juice in a clear glass" },
];

/* --------------------------------- Gallery --------------------------------- */

export const galleryWilpattu: Photo[] = [
  { src: u("photo-1661768508643-e260f6f8e06c"), alt: "Leopard walking on a dirt road in Wilpattu", tag: "Leopard" },
  { src: u("photo-1770851972315-b52ec9a4cda8"), alt: "Storm clouds over a silhouetted villu lake at dusk", tag: "The Villus" },
  { src: u("photo-1705936981595-dea87508ce84"), alt: "Large leopard crossing a park road", tag: "Leopard" },
  { src: u("photo-1533484482814-3fe2d922be89"), alt: "Elephants bathing in a Wilpattu waterhole", tag: "Elephants" },
  { src: u("photo-1444724334165-e7050f2229a1"), alt: "Dry-zone forest shrouded in morning fog", tag: "The Forest" },
  { src: u("photo-1548148491-90655471726c"), alt: "Peacock in full display on open grassland", tag: "Birdlife" },
  { src: u("photo-1627401099591-4772d63b86a4"), alt: "Leopard drinking at the water's edge", tag: "Leopard" },
  { src: u("photo-1719807633728-7ff13f7f2b61"), alt: "Elephant herd crossing a shallow river", tag: "Elephants" },
  { src: u("photo-1760640018928-94f1a834a74f"), alt: "Two sloth bears wrestling on a rock", tag: "Sloth Bear" },
  { src: u("photo-1689009622782-f351c37639f7"), alt: "Lone tree standing in the middle of a villu", tag: "The Villus" },
  { src: u("photo-1620050825606-d8c952569ea0"), alt: "Mugger crocodile gliding through still water", tag: "Reptiles" },
  { src: u("photo-1543946207-39bd91e70ca7"), alt: "Spotted deer resting under a shade tree", tag: "Deer" },
  { src: u("photo-1743014118271-415197f9b0ef"), alt: "Leopard yawning in the afternoon heat", tag: "Leopard" },
  { src: u("photo-1535025075092-5a1cf795130b"), alt: "Mist hanging over the forest canopy", tag: "The Forest" },
  { src: u("photo-1619183318129-cd95bc882275"), alt: "Two elephants grazing on a green plain", tag: "Elephants" },
  { src: u("photo-1722845831035-6957a1508341"), alt: "Sunset burning over a villu lake", tag: "The Villus" },
  { src: u("photo-1621847473222-d85c022cbf07"), alt: "Leopard cooling off in shallow water", tag: "Leopard" },
  { src: u("photo-1559048958-4d1a3dc247d1"), alt: "Peacock perched with iridescent plumage", tag: "Birdlife" },
];

export const galleryLodge: Photo[] = [
  { src: u("photo-1774280954999-9758f11f3d41"), alt: "Suite bedroom window framing the jungle", tag: "Suites" },
  { src: u("photo-1571896349842-33c89424de2d"), alt: "Infinity pool glowing at dusk", tag: "Pool" },
  { src: u("photo-1605538032432-a9f0c8d9baac"), alt: "Timber lodge house among palm trees", tag: "The Lodge" },
  { src: u("photo-1582719478250-c89cae4dc85b"), alt: "Four-poster bed dressed in white linen", tag: "Suites" },
  { src: u("photo-1725280894654-0b3dcad57df3"), alt: "Luxury tent pitched beneath tall trees", tag: "Tented Camp" },
  { src: u("photo-1549294413-26f195200c16"), alt: "Poolside loungers under coconut palms", tag: "Pool" },
  { src: u("photo-1742281095650-dd3c50c08772"), alt: "Rice and curry feast served on a lotus leaf", tag: "Dining" },
  { src: u("photo-1731336478850-6bce7235e320"), alt: "Villa bedroom in timber and linen", tag: "Villas" },
  { src: u("photo-1655298614846-1ca9a58b12c1"), alt: "Safari tents scattered through the trees", tag: "Tented Camp" },
  { src: u("photo-1709926701984-f5ae0099595f"), alt: "Ceylon tea poured at a garden table", tag: "Dining" },
  { src: u("photo-1610641818989-c2051b5e2cfd"), alt: "Palms reflected in the resort pool", tag: "Pool" },
  { src: u("photo-1662841540530-2f04bb3291e8"), alt: "Villa interior with ceiling fan and soft light", tag: "Villas" },
  { src: u("photo-1742281095661-29de44440bb6"), alt: "Sri Lankan breakfast spread after the dawn safari", tag: "Dining" },
  { src: u("photo-1714669257411-84552ac065bf"), alt: "Forest hut hidden in the greenery", tag: "The Lodge" },
];

/* ---------------------------------- Facts ---------------------------------- */

export const parkFacts = [
  { value: "1,317", unit: "km²", label: "Sri Lanka's largest national park" },
  { value: "~60", unit: "villus", label: "Rain-fed natural lakes dot the park" },
  { value: "1938", unit: "est.", label: "One of the island's oldest reserves" },
  { value: "31", unit: "mammals", label: "Leopard, sloth bear, elephant & more" },
];

export const testimonials = [
  {
    quote:
      "Three leopard sightings in one morning — our tracker read the alarm calls like a book. The lodge at night, with fireflies over the waterhole, felt unreal.",
    name: "Amelia R.",
    origin: "United Kingdom",
  },
  {
    quote:
      "We've done Yala, Serengeti and Kruger. Wilpattu with this team was the wildest of them all — empty roads, patient guiding, and that rice & curry picnic!",
    name: "Daniel & Mika T.",
    origin: "Germany",
  },
  {
    quote:
      "The Villu Suite is worth every cent. We watched a sloth bear from our plunge pool at breakfast. Staff remembered everything, down to my kids' names.",
    name: "Shalini W.",
    origin: "Australia",
  },
];

export const visitInfo = {
  hours: "6:00 AM – 6:00 PM daily (last entry 4:30 PM)",
  bestTime: "February to October (dry season). May–July for sloth bears in palu fruit season.",
  entrance: "Hunuwilagama (main) gate — 30 km from Puttalam, 45 km from Anuradhapura.",
  fromColombo: "≈ 180 km / 3.5 h drive via the A3 Puttalam road.",
  coords: { lat: 8.4581, lng: 80.0503 },
};
