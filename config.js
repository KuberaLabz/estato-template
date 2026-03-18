// ============================================================
//  ESTATO — Luxury Real Estate Template
//  ✏️  Edit ONLY this file. Everything updates automatically.
// ============================================================

const CONFIG = {

  // --- BRAND ---
  firmName:        "Estato",
  firmTagline:     "Rare Properties. Exceptional Representation.",
  firmDesc:        "We don't list properties. We curate them. A boutique real estate firm specializing in architecturally significant homes and investment-grade estates.",
  firmYear:        "2008",
  firmYearsActive: new Date().getFullYear() - 2008,
  legalName:       "Estato Realty Group LLC",
  legalYear:       "2026",

  // --- VAPI AI AGENT ---
  vapiPublicKey:   "YOUR_VAPI_PUBLIC_KEY",
  vapiAssistantId: "YOUR_VAPI_ASSISTANT_ID",
  chatWelcome:     "Hello — I'm the Estato concierge. I can help you explore our current listings, arrange private viewings, or answer any questions.",

  // --- CONTACT ---
  phone:        "+1 (310) 000-0000",
  email:        "hello@estato.co",
  address:      "432 Wilshire Blvd, Suite 1200",
  city:         "Beverly Hills, CA 90210",
  calendarLink: "#contact",
  privacyEmail: "privacy@estato.co",

  // --- SOCIAL ---
  instagram: "#",
  linkedin:  "#",
  youtube:   "#",
  twitter:   "#",

  // --- NAV ---
  navLinks: [
    { label: "Properties", href: "#listings"  },
    { label: "Approach",   href: "#approach"  },
    { label: "Our Team",   href: "#team"      },
    { label: "Areas",      href: "#areas"     },
    { label: "Journal",    href: "#journal"   },
    { label: "Contact",    href: "#contact"   },
  ],
  navCTA: "Private Inquiry",

  // --- HERO ---
  heroEyebrow:   "Beverly Hills · Bel Air · Malibu",
  heroHeadline:  "Where architecture meets legacy.",
  heroSub:       "We represent the most thoughtfully designed homes in Southern California — for buyers and sellers who understand that a home is not just an asset. It's a statement.",
  heroCTA:       "View Current Properties",
  heroSecondary: "Private Inquiry",

  // --- STATS ---
  stats: [
    { value: "1.4", suffix: "B+", label: "In Sales Volume"     },
    { value: "340", suffix: "+",  label: "Homes Represented"   },
    { value: "17",  suffix: "",   label: "Years of Excellence"  },
    { value: "98",  suffix: "%",  label: "Client Satisfaction" },
  ],

  // ============================================================
  // --- LISTINGS ---
  // Layout logic (auto-assigned by index):
  //   Index 0 → large (spans 2 cols)     + tall (spans 2 rows)
  //   Index 1 → normal (right of large, row 1)
  //   Index 2 → normal (right of large, row 2)
  //   Index 3 → normal
  //   Index 4 → normal
  //   Index 5 → large (spans 2 cols)
  //   Index 6 → normal
  //   Index 7 → normal
  //   Index 8 → normal
  // ============================================================
  listings: [
    {
      id:           "L001",
      address:      "1284 Carla Ridge Drive",
      neighborhood: "Beverly Hills",
      price:        "$12,750,000",
      beds: 5, baths: 7, sqft: "8,400",
      type:         "Estate",
      status:       "Available",
      tag:          "New Listing",
      desc:         "A commanding mid-century modern estate perched above the city with unobstructed canyon and ocean views. Reimagined by a celebrated LA architect in 2022.",
      features:     ["Infinity pool & spa", "Chef's kitchen by Bulthaup", "Home theatre", "4-car motor court", "Smart home throughout"],
      agent:        "Victoria Hale",
      bgIndex:      0,
    },
    {
      id:           "L002",
      address:      "27 Malibu Colony Road",
      neighborhood: "Malibu",
      price:        "$19,500,000",
      beds: 6, baths: 8, sqft: "10,200",
      type:         "Oceanfront Estate",
      status:       "Available",
      tag:          "Featured",
      desc:         "Direct oceanfront compound on Malibu Colony with rare dual access. Designed by Tadao Ando — one of only a handful of his residential works in the United States.",
      features:     ["Private beach access", "Ando-designed interiors", "Glass-wall ocean views", "Guest house", "Wine cellar"],
      agent:        "Marcus Webb",
      bgIndex:      1,
    },
    {
      id:           "L003",
      address:      "825 Bel Air Road",
      neighborhood: "Bel Air",
      price:        "$8,900,000",
      beds: 4, baths: 5, sqft: "5,600",
      type:         "Contemporary Villa",
      status:       "Available",
      tag:          "Price Reduced",
      desc:         "A warm contemporary villa set on over an acre with sweeping city-to-ocean views. Features a resort-style garden, gallery walls, and an extraordinary principal suite.",
      features:     ["1-acre manicured grounds", "Formal dining salon", "Art studio", "Gym & sauna", "Gated & private"],
      agent:        "Victoria Hale",
      bgIndex:      2,
    },
    {
      id:           "L004",
      address:      "712 Siena Way",
      neighborhood: "Holmby Hills",
      price:        "$31,000,000",
      beds: 8, baths: 11, sqft: "18,200",
      type:         "Grand Estate",
      status:       "Off Market",
      tag:          "Off Market",
      desc:         "One of the most significant Holmby Hills estates to change hands in a decade. English manor provenance, rebuilt to exacting standards in 2023 with every modern amenity concealed seamlessly.",
      features:     ["Full staff quarters", "Indoor pool & spa", "Ballroom & formal salon", "8-car underground garage", "3-acre private gardens"],
      agent:        "Victoria Hale",
      bgIndex:      6,
    },
    {
      id:           "L005",
      address:      "3 Stradella Road",
      neighborhood: "Bel Air",
      price:        "$24,000,000",
      beds: 7, baths: 10, sqft: "14,800",
      type:         "Trophy Estate",
      status:       "Off Market",
      tag:          "Off Market",
      desc:         "A trophy estate of extraordinary scale. Originally commissioned in the 1960s, fully rebuilt in 2021. One of the most architecturally significant homes in Bel Air.",
      features:     ["Tennis court & pavilion", "12-seat home cinema", "Staff quarters", "Car gallery (8 vehicles)", "Rooftop terrace"],
      agent:        "Marcus Webb",
      bgIndex:      3,
    },
    {
      id:           "L006",
      address:      "1118 Laurel Way",
      neighborhood: "Beverly Hills Flats",
      price:        "$5,450,000",
      beds: 4, baths: 4, sqft: "4,100",
      type:         "Modern Residence",
      status:       "Available",
      tag:          "",
      desc:         "A beautifully proportioned modern residence in the coveted Flats, designed for effortless indoor-outdoor California living. Quiet street, walk to everything.",
      features:     ["Open-plan living", "Pocket doors to garden", "Marble kitchen", "3-car garage", "Primary suite terrace"],
      agent:        "Sofia Nakamura",
      bgIndex:      4,
    },
    {
      id:           "L007",
      address:      "456 Copa de Oro Road",
      neighborhood: "Bel Air",
      price:        "$15,200,000",
      beds: 6, baths: 7, sqft: "9,300",
      type:         "Spanish Colonial Revival",
      status:       "Available",
      tag:          "Architectural",
      desc:         "A rare restored Spanish Colonial Revival with irreplaceable period details — arched loggias, hand-painted tilework, original Saltillo floors — updated with quiet luxury interiors.",
      features:     ["Arched colonnade courtyard", "Hand-painted original tiles", "Formal library", "Pool & poolhouse", "5-acre gardens"],
      agent:        "Sofia Nakamura",
      bgIndex:      5,
    },
    {
      id:           "L008",
      address:      "2241 Bowmont Drive",
      neighborhood: "Beverly Hills",
      price:        "$9,750,000",
      beds: 5, baths: 6, sqft: "6,800",
      type:         "Penthouse Residence",
      status:       "Available",
      tag:          "New Listing",
      desc:         "A rare sky-level residence atop a landmark building with 360° views spanning from the Pacific to downtown. Bespoke Italian interiors, private rooftop terrace, and white-glove concierge service.",
      features:     ["360° panoramic views", "Private rooftop terrace", "Bespoke Italian fit-out", "24-hour concierge", "3 secure parking"],
      agent:        "Marcus Webb",
      bgIndex:      8,
    },
    {
      id:           "L009",
      address:      "18 Ramirez Canyon Road",
      neighborhood: "Pacific Palisades",
      price:        "$7,200,000",
      beds: 5, baths: 5, sqft: "5,200",
      type:         "Coastal Retreat",
      status:       "Available",
      tag:          "",
      desc:         "A serene coastal retreat set in the canyons above the Palisades. Warm natural materials, ocean-facing terraces, and a seamless connection to the surrounding landscape.",
      features:     ["Canyon & ocean views", "Natural cedar & stone", "Lap pool & outdoor kitchen", "Guest casita", "Gated private road"],
      agent:        "Sofia Nakamura",
      bgIndex:      7,
    },
  ],

  // --- APPROACH ---
  approachHeadline: "Our approach to the extraordinary.",
  approachText:     "We work with a small number of clients at any given time — intentionally. Because real estate at this level demands the same attention you'd give to acquiring a museum-quality work of art.",
  approachPillars: [
    {
      number: "01",
      title:  "Curation over Volume",
      desc:   "We represent fewer than 30 properties a year. Every listing is personally vetted for architectural merit, privacy, and investment quality.",
    },
    {
      number: "02",
      title:  "Access to the Invisible Market",
      desc:   "Sixty percent of our transactions happen before a home ever reaches the public market. Our network opens doors that don't exist online.",
    },
    {
      number: "03",
      title:  "White-Glove Representation",
      desc:   "From private viewings to close of escrow, every detail is managed in-house. You have one point of contact who knows your situation completely.",
    },
    {
      number: "04",
      title:  "Discreet by Design",
      desc:   "Many of our clients prefer absolute privacy. We are fluent in confidential transactions — protecting identity, intentions, and terms at every stage.",
    },
  ],

  // --- TEAM ---
  teamHeadline: "The people behind the properties.",
  teamSub:      "A small, senior team. Everyone you work with has personally closed over $100M in transactions.",
  team: [
    {
      name:       "Victoria Hale",
      title:      "Founding Partner",
      bio:        "17 years. $800M+ in career sales. Former architecture editor at Architectural Digest, which means she evaluates every home with the eye of a critic and the instinct of an investor.",
      specialty:  "Beverly Hills · Bel Air",
      closings:   "$800M+",
      initials:   "VH",
      colorIndex: 0,
    },
    {
      name:       "Marcus Webb",
      title:      "Senior Partner",
      bio:        "12 years. Malibu and coastal property specialist. Known for extraordinary discretion and a network that spans Hollywood, Silicon Valley, and international buyers.",
      specialty:  "Malibu · Pacific Palisades",
      closings:   "$420M+",
      initials:   "MW",
      colorIndex: 1,
    },
    {
      name:       "Sofia Nakamura",
      title:      "Associate Partner",
      bio:        "7 years. The fastest-rising agent in our firm. Architectural background, Japanese-American heritage, and an eye for design that our clients describe as 'uncanny.'",
      specialty:  "Beverly Hills Flats · Holmby Hills",
      closings:   "$180M+",
      initials:   "SN",
      colorIndex: 2,
    },
  ],

  // --- AREAS ---
  areasHeadline: "The markets we know best.",
  areas: [
    {
      name:  "Beverly Hills",
      count: "142 transactions",
      desc:  "The world's most recognizable address. We know every block, every view corridor, every pocket of value that the market hasn't yet priced in.",
    },
    {
      name:  "Bel Air",
      count: "98 transactions",
      desc:  "Where old money and new architecture meet. Estates of genuine consequence on streets that reward deep knowledge and long relationships.",
    },
    {
      name:  "Malibu",
      count: "61 transactions",
      desc:  "Oceanfront, canyon, and Colony. The rarest California lifestyle — we know who owns every parcel and which ones may quietly become available.",
    },
    {
      name:  "Holmby Hills",
      count: "23 transactions",
      desc:  "The quietest enclave of the Platinum Triangle. For buyers who prioritize scale, absolute privacy, and the kind of address that requires no explanation.",
    },
    {
      name:  "Pacific Palisades",
      count: "18 transactions",
      desc:  "Coastal community living at its most refined. Beloved by families and architects in equal measure — and increasingly sought by international buyers.",
    },
  ],

  // --- JOURNAL ---
  journalHeadline: "From the journal.",
  journalPosts: [
    {
      category: "Market Insight",
      title:    "Why Malibu Colony Continues to Outperform Every Other Coastal Market",
      date:     "March 2026",
      read:     "6 min read",
    },
    {
      category: "Architecture",
      title:    "The Case for Buying a Mid-Century Home Before the Rest of the Market Catches On",
      date:     "February 2026",
      read:     "8 min read",
    },
    {
      category: "Strategy",
      title:    "Off-Market Acquisitions: How the Most Significant Homes Change Hands Quietly",
      date:     "January 2026",
      read:     "5 min read",
    },
  ],

  // --- TESTIMONIALS ---
  testimonials: [
    {
      quote:    "Victoria found us a property that had never been publicly listed. The transaction was entirely confidential, handled with the kind of discretion I've never experienced with any other firm.",
      name:     "Private Client",
      title:    "Acquired 2024 · Bel Air",
      initials: "PC",
    },
    {
      quote:    "We interviewed six agencies. Estato was the only firm that talked about our home as a piece of architecture, not just a listing. That perspective added $3M to our final sale price.",
      name:     "The Harrington Family",
      title:    "Sold 2024 · Beverly Hills · $18.4M",
      initials: "TH",
    },
    {
      quote:    "Marcus sourced our Malibu Colony property in under 60 days — off market. We'd been searching for three years with another firm. One call to Estato changed everything.",
      name:     "A.K.",
      title:    "Acquired 2025 · Malibu Colony",
      initials: "AK",
    },
  ],

};
