/* ============================================================
   Snooty Beta Gallery: shared seed cast.
   Mirrors server/prisma/seed.ts so the gallery matches the real
   product. Hero stylist = Jordyn Ellis (the app's showcase
   stylist), so beta testers meet her again in the live app.
   Every image URL here was liveness-checked on 2026-07-06.
   ============================================================ */
(function () {
  'use strict';
  const u = (id, w) => 'https://images.unsplash.com/' + id + '?w=' + (w || 800) + '&q=85';

  const IMG = {
    knotlessSmall: u('photo-1572955304332-bf714bd49add'),
    knotlessBoho: u('photo-1592328906746-0a3ca0bde253'),
    knotlessMedium: u('photo-1594254773847-9fce26e950bc'),
    knotlessJumbo: u('photo-1616166183781-0fdd2ef83374'),
    boxBurgundy: u('photo-1606416132922-22ab37c1231e'),
    boxLarge: u('photo-1638794249638-b97e05aaa900'),
    stitch: u('photo-1673470907547-1c0c6a996095'),
    passionTwist: u('photo-1608913906628-1ba9839d7c90'),
    senegalese: u('photo-1729960363960-e744e9dd3a0c'),
    senegaleseDark: u('photo-1729960363958-1703758ef961'),
    butterflyLocs: u('photo-1720010944710-01161d017608'),
    fauxLocsDistressed: u('photo-1598461209732-946389b57e7c'),
    fauxLocsHoney: u('photo-1722079778174-c373722ae858'),
    softLocs: u('photo-1680002572771-a5a9a287aa74'),
    crochetLocs: u('photo-1680002571698-018fed6fc268'),
    starterLocs: u('photo-1653263169788-9332cdbf07f5'),
    retwist: u('photo-1622995812138-ffc78b02b653'),
    retwistDefined: u('photo-1662991859083-86e0b45208b0'),
    starterLocsThick: u('photo-1593529334658-a243a47ad02e'),
    blowout: u('photo-1519699047748-de8e457a634e'),
    silkPressNyc: u('photo-1709810529099-0ce6102692df'),
    blowoutWrap: u('photo-1565357419076-6acd4a10094e'),
    silkPressEdges: u('photo-1632765854612-9b02b6ec2b15'),
    washAndGo: u('photo-1577746838851-816a43ca8733'),
    balayage: u('photo-1560869713-7d0a29430803'),
    highlights: u('photo-1519915028121-7d3463d20b13'),
    colorRed: u('photo-1583147610149-78ac5cb5a303'),
    balayageCaramel: u('photo-1598363576971-69666ab1130a'),
    chestnut: u('photo-1634734162663-6ff483efd839'),
    brunette: u('photo-1614173968962-0e61c5ed196f'),
    vividPurple: u('photo-1631955081622-fb57ae4cb686'),
    fadeWaves: u('photo-1630827020718-3433092696e7'),
    fadeBeard: u('photo-1629189784191-9afdcbcb0398'),
    fadeLow: u('photo-1593702275687-f8b402bf1fb5'),
    updoBraided: u('photo-1572954889228-2b12a55144d1'),
    chignon: u('photo-1648010035195-6b0a56e14667'),
    bridalHalfUp: u('photo-1663851071150-b6617bbee927'),
    goddessCrochet: u('photo-1577806934037-32d94e326e84'),
    kidsBeads: u('photo-1698299708000-bb14e23fe2df'),
    tapeIns: u('photo-1617694820985-a5476fe22722'),
    editorial1: u('photo-1522337660859-02fbefca4702'),
    editorial2: u('photo-1580618672591-eb180b1a973f'),
  };

  const AV = {
    jordyn: u('photo-1531746020798-e6953c6e8e04', 200),
    maya: u('photo-1534528741775-53994a69daeb', 200),
    tasha: u('photo-1494790108377-be9c29b29330', 200),
    imani: u('photo-1522337360788-8b13dee7a37e', 200),
    keisha: u('photo-1487412720507-e7ab37603c6f', 200),
    jordan: u('photo-1507003211169-0a1dd7228f2d', 200),
    deja: u('photo-1438761681033-6461ffad8d80', 200),
    nia: u('photo-1544005313-94ddf0286df2', 200),
    zora: u('photo-1520813792240-56fc4a3765a7', 200),
    client: u('photo-1531123897727-8f129e1688ce', 200),
  };

  const CATEGORIES = [
    { slug: 'all', name: 'All' },
    { slug: 'knotless-braids', name: 'Knotless Braids' },
    { slug: 'box-braids', name: 'Box Braids' },
    { slug: 'locs-retwist', name: 'Locs & Retwist' },
    { slug: 'twists', name: 'Twists' },
    { slug: 'cornrows-stitch-braids', name: 'Cornrows & Stitch' },
    { slug: 'faux-locs', name: 'Faux Locs' },
    { slug: 'silk-press', name: 'Silk Press' },
    { slug: 'hair-color', name: 'Hair Color' },
    { slug: 'natural-styles', name: 'Natural Styles' },
    { slug: 'extensions', name: 'Extensions' },
    { slug: 'cuts-and-fades', name: 'Cuts & Fades' },
    { slug: 'updos-and-wedding', name: 'Updos & Wedding' },
  ];

  /* The hero stylist. Same identity as the real app's showcase account. */
  const HERO = {
    id: 'jordyn',
    name: 'Jordyn Ellis',
    business: 'Roots & Ritual',
    city: 'Fayetteville, NC',
    avatar: AV.jordyn,
    rating: 4.9,
    reviewCount: 87,
    years: 11,
    bio: 'Fayetteville-based braider with 11 years of experience. Knotless braids, loc journeys, and tribal styles. Every client leaves feeling like themselves, just elevated.',
    hours: 'Mon to Sat, 9:00 AM to 7:00 PM',
    services: [
      { id: 'sv1', name: 'Knotless Braids - Small', cents: 28000, mins: 390, slug: 'knotless-braids' },
      { id: 'sv2', name: 'Knotless Braids - Medium', cents: 22000, mins: 300, slug: 'knotless-braids' },
      { id: 'sv3', name: 'Boho Knotless w/ Curls', cents: 34000, mins: 420, slug: 'knotless-braids' },
      { id: 'sv4', name: 'Tribal / Fulani Braids', cents: 27000, mins: 300, slug: 'knotless-braids' },
      { id: 'sv5', name: 'Starter Locs', cents: 38000, mins: 480, slug: 'locs-retwist' },
      { id: 'sv6', name: 'Loc Retwist', cents: 9000, mins: 90, slug: 'locs-retwist' },
      { id: 'sv7', name: 'Hair Wash & Blow-Dry', cents: 5500, mins: 75, slug: null },
    ],
    looks: [
      { id: 'lk1', caption: 'Small knotless, jet black, hip length', img: IMG.knotlessSmall, slug: 'knotless-braids', likes: 2800, serviceId: 'sv1',
        angles: [IMG.knotlessSmall, IMG.knotlessMedium, IMG.knotlessJumbo] },
      { id: 'lk2', caption: 'Boho knotless, honey blonde', img: IMG.knotlessBoho, slug: 'knotless-braids', likes: 2100, serviceId: 'sv3',
        angles: [IMG.knotlessBoho, IMG.knotlessSmall, IMG.editorial1] },
      { id: 'lk3', caption: 'Medium knotless, chocolate brown', img: IMG.knotlessMedium, slug: 'knotless-braids', likes: 1400, serviceId: 'sv2',
        angles: [IMG.knotlessMedium, IMG.knotlessJumbo] },
      { id: 'lk4', caption: 'Tribal braids, cowrie shells', img: IMG.boxBurgundy, slug: 'knotless-braids', likes: 980, serviceId: 'sv4',
        angles: [IMG.boxBurgundy, IMG.stitch] },
      { id: 'lk5', caption: 'Starter locs, two-strand twists', img: IMG.starterLocs, slug: 'locs-retwist', likes: 760, serviceId: 'sv5',
        angles: [IMG.starterLocs, IMG.starterLocsThick, IMG.retwist] },
      { id: 'lk6', caption: 'Fresh retwist, defined roots', img: IMG.retwistDefined, slug: 'locs-retwist', likes: 540, serviceId: 'sv6',
        angles: [IMG.retwistDefined, IMG.retwist] },
    ],
  };

  /* Repeat clients (CRM, messages, day-in-the-life). */
  const CLIENTS = [
    { id: 'maya', name: 'Maya Reyes', avatar: AV.maya, visits: 6, spentCents: 132000, tag: 'Regular',
      note: 'Sensitive edges. Prefers medium knotless, size M bundles. Books 8 weeks out.' },
    { id: 'tasha', name: 'Tasha Whitfield', avatar: AV.tasha, visits: 11, spentCents: 241000, tag: 'VIP',
      note: 'Loc retwist every 5 weeks. Allergic to tea tree oil. Always on time.' },
    { id: 'imani', name: 'Imani Cole', avatar: AV.imani, visits: 3, spentCents: 68000, tag: 'Regular',
      note: 'Boho knotless with curls. Likes honey blonde 27 mixed in.' },
    { id: 'keisha', name: 'Keisha Banks', avatar: AV.keisha, visits: 1, spentCents: 22000, tag: 'New',
      note: 'First visit June 14. Found Roots & Ritual through the Discover feed.' },
    { id: 'deja', name: 'Deja Simmons', avatar: AV.deja, visits: 2, spentCents: 47000, tag: 'New',
      note: 'Starter loc consult done. Journey begins this fall.' },
  ];

  /* Reviews tied to completed appointments (the trust story). */
  const REVIEWS = [
    { client: 'Tasha Whitfield', avatar: AV.tasha, stars: 5, service: 'Loc Retwist', when: '2 days ago',
      text: 'Eleven visits in and Jordyn has never rushed a single loc. My retwist lasts longer than anywhere else in Charlotte.' },
    { client: 'Maya Reyes', avatar: AV.maya, stars: 5, service: 'Knotless Braids - Medium', when: '1 week ago',
      text: 'She actually listens. Zero tension on my edges and the parts are immaculate. Already rebooked.', photo: IMG.knotlessMedium },
    { client: 'Imani Cole', avatar: AV.imani, stars: 5, service: 'Boho Knotless w/ Curls', when: '3 weeks ago',
      text: 'The boho curls blended perfectly with the honey blonde. I sent her page to my whole group chat.', photo: IMG.knotlessBoho },
    { client: 'Keisha Banks', avatar: AV.keisha, stars: 4, service: 'Knotless Braids - Medium', when: '1 month ago',
      text: 'Found her on Snooty from one photo and the real thing matched it. Booking with the deposit felt official, no back and forth.' },
  ];

  /* Supporting stylists (Top Talent sidebar, feed variety). All exist in the real seed. */
  const STYLISTS = [
    { id: 'nia', name: 'Nia Carter', business: 'Braids by Nia', city: 'Atlanta, GA', avatar: AV.nia, rating: 4.9, reviewCount: 118 },
    { id: 'camille', name: 'Camille Osei', business: 'Camille Does Hair', city: 'Fayetteville, NC', avatar: AV.tasha, rating: 4.7, reviewCount: 55 },
    { id: 'zora', name: 'Zora Mitchell', business: 'Loc Culture by Zora', city: 'Houston, TX', avatar: AV.zora, rating: 4.8, reviewCount: 74 },
    { id: 'brianna', name: 'Brianna Lee', business: 'The Press Bar', city: 'New York, NY', avatar: AV.maya, rating: 4.8, reviewCount: 145 },
    { id: 'jade', name: 'Jade Rivera', business: 'Jade Color Studio', city: 'Los Angeles, CA', avatar: AV.deja, rating: 4.9, reviewCount: 187 },
    { id: 'marcus', name: 'Marcus Webb', business: 'Webb Cuts', city: 'Houston, TX', avatar: AV.jordan, rating: 4.9, reviewCount: 312 },
  ];

  /* Discover feed: looks across the platform. Hero's looks rank first in her city. */
  const FEED = [
    { img: IMG.knotlessSmall, caption: 'Small knotless, jet black, hip length', stylist: 'Jordyn Ellis', business: 'Roots & Ritual', city: 'Fayetteville, NC', slug: 'knotless-braids', likes: 2800, cents: 28000, heroLook: 'lk1' },
    { img: IMG.balayage, caption: 'Honey balayage, natural texture', stylist: 'Jade Rivera', business: 'Jade Color Studio', city: 'Los Angeles, CA', slug: 'hair-color', likes: 4100, cents: 28000 },
    { img: IMG.passionTwist, caption: 'Passion twists, 18 inches, auburn', stylist: 'Natasha Brown', business: 'Tasha Twists', city: 'Chicago, IL', slug: 'twists', likes: 1600, cents: 19000 },
    { img: IMG.knotlessBoho, caption: 'Boho knotless, honey blonde', stylist: 'Jordyn Ellis', business: 'Roots & Ritual', city: 'Fayetteville, NC', slug: 'knotless-braids', likes: 2100, cents: 34000, heroLook: 'lk2' },
    { img: IMG.silkPressNyc, caption: 'Silk press, perfect edges', stylist: 'Brianna Lee', business: 'The Press Bar', city: 'New York, NY', slug: 'silk-press', likes: 2800, cents: 14000 },
    { img: IMG.starterLocs, caption: 'Starter locs, two-strand twists', stylist: 'Jordyn Ellis', business: 'Roots & Ritual', city: 'Fayetteville, NC', slug: 'locs-retwist', likes: 760, cents: 38000, heroLook: 'lk5' },
    { img: IMG.boxBurgundy, caption: 'Box braids, burgundy tips', stylist: 'Camille Osei', business: 'Camille Does Hair', city: 'Fayetteville, NC', slug: 'box-braids', likes: 1200, cents: 20000 },
    { img: IMG.fadeWaves, caption: 'Mid fade, waves on top', stylist: 'Marcus Webb', business: 'Webb Cuts', city: 'Houston, TX', slug: 'cuts-and-fades', likes: 4100, cents: 4500 },
    { img: IMG.washAndGo, caption: 'Wash and go, 4C curl pop', stylist: 'Amara Diallo', business: 'Crown Natural Studio', city: 'Washington, DC', slug: 'natural-styles', likes: 2800, cents: 8000 },
    { img: IMG.knotlessMedium, caption: 'Medium knotless, chocolate brown', stylist: 'Jordyn Ellis', business: 'Roots & Ritual', city: 'Fayetteville, NC', slug: 'knotless-braids', likes: 1400, cents: 22000, heroLook: 'lk3' },
    { img: IMG.butterflyLocs, caption: 'Butterfly locs, 22 inches', stylist: 'Deja Monroe', business: 'Deja Twist', city: 'Fayetteville, NC', slug: 'twists', likes: 990, cents: 22000 },
    { img: IMG.highlights, caption: 'Full highlights, beachy blonde', stylist: 'Jade Rivera', business: 'Jade Color Studio', city: 'Los Angeles, CA', slug: 'hair-color', likes: 3300, cents: 22000 },
    { img: IMG.updoBraided, caption: 'Braided updo for wedding day', stylist: 'Grace Okonkwo', business: 'Grace Bridal Hair', city: 'New York, NY', slug: 'updos-and-wedding', likes: 3100, cents: 28000 },
    { img: IMG.retwistDefined, caption: 'Fresh retwist, defined roots', stylist: 'Jordyn Ellis', business: 'Roots & Ritual', city: 'Fayetteville, NC', slug: 'locs-retwist', likes: 540, cents: 9000, heroLook: 'lk6' },
    { img: IMG.senegalese, caption: 'Senegalese twists, waist length', stylist: 'Natasha Brown', business: 'Tasha Twists', city: 'Chicago, IL', slug: 'twists', likes: 740, cents: 25000 },
    { img: IMG.fauxLocsHoney, caption: 'Distressed faux locs, honey brown', stylist: 'Diamond Holt', business: 'Diamond Braids', city: 'Fayetteville, NC', slug: 'faux-locs', likes: 580, cents: 24000 },
    { img: IMG.blowout, caption: 'Blowout, big volume, defined ends', stylist: 'Maya Johnson', business: 'Silk & Shine', city: 'Los Angeles, CA', slug: 'silk-press', likes: 2100, cents: 12000 },
    { img: IMG.tapeIns, caption: 'Tape-ins, blended seamlessly', stylist: 'Keisha Thomas', business: 'Luxe Extensions', city: 'Atlanta, GA', slug: 'extensions', likes: 3600, cents: 30000 },
    { img: IMG.knotlessJumbo, caption: 'Jumbo knotless, quick install', stylist: 'Tiana Graves', business: 'Tiana G Hair', city: 'Fayetteville, NC', slug: 'knotless-braids', likes: 780, cents: 20000 },
    { img: IMG.stitch, caption: 'Stitch braids, 8 rows, clean parts', stylist: 'Kezia Bright', business: 'Kezia Braids', city: 'Fayetteville, NC', slug: 'cornrows-stitch-braids', likes: 1900, cents: 11000 },
    { img: IMG.chignon, caption: 'Sleek chignon, editorial finish', stylist: 'Grace Okonkwo', business: 'Grace Bridal Hair', city: 'New York, NY', slug: 'updos-and-wedding', likes: 2400, cents: 16000 },
    { img: IMG.colorRed, caption: 'Color correction, vibrant red', stylist: 'Jade Rivera', business: 'Jade Color Studio', city: 'Los Angeles, CA', slug: 'hair-color', likes: 2700, cents: 45000 },
    { img: IMG.goddessCrochet, caption: 'Goddess crochet, curly ends', stylist: 'Simone Waters', business: 'Crochet by Simone', city: 'Fayetteville, NC', slug: 'crochet-curly-installs', likes: 1200, cents: 17000 },
    { img: IMG.kidsBeads, caption: 'Kids cornrows, colorful beads', stylist: 'Kezia Bright', business: 'Kezia Braids', city: 'Fayetteville, NC', slug: 'kids-protective-styles', likes: 1100, cents: 8000 },
    { img: IMG.softLocs, caption: 'Soft locs, 24 inches', stylist: 'Zora Mitchell', business: 'Loc Culture by Zora', city: 'Houston, TX', slug: 'faux-locs', likes: 760, cents: 27000 },
    { img: IMG.fadeBeard, caption: 'Taper fade, beard blend', stylist: 'Mike Cannon', business: 'Cannon Cuts', city: 'Fayetteville, NC', slug: 'cuts-and-fades', likes: 3100, cents: 5500 },
    { img: IMG.balayageCaramel, caption: 'Caramel balayage on dark hair', stylist: 'Jade Rivera', business: 'Jade Color Studio', city: 'Los Angeles, CA', slug: 'hair-color', likes: 2200, cents: 28000 },
    { img: IMG.bridalHalfUp, caption: 'Half-up bridal style', stylist: 'Grace Okonkwo', business: 'Grace Bridal Hair', city: 'New York, NY', slug: 'updos-and-wedding', likes: 1900, cents: 18000 },
  ];

  /* Message thread pinned to a booking (messaging + day-in-the-life). */
  const THREAD = {
    client: 'Maya Reyes',
    avatar: AV.maya,
    booking: { service: 'Knotless Braids - Medium', when: 'Sat, 11:00 AM', depositCents: 4400 },
    messages: [
      { from: 'them', text: 'Hi! Just booked for Saturday. Should I come with my hair blown out?', at: '9:02 AM' },
      { from: 'me', text: 'Hey Maya! Yes please, clean and stretched. No product if you can.', at: '9:15 AM' },
      { from: 'them', text: 'Perfect. See you Saturday!', at: '9:16 AM' },
    ],
    reply: 'Got it, thank you! Counting down already.',
  };

  const PLATFORM = {
    depositPct: 20,
    commissionPct: 5,
    annualFeeCents: 2000,
    /* Receipts-slide comparisons, from docs/reference/research/competitor-research.md */
    competitors: {
      styleseat: { monthly: 35, newClientPct: 20 },
      booksy: { monthly: 29.99, boostPct: 30 },
    },
  };

  window.SNOOTY_SEED = {
    img: IMG, av: AV,
    categories: CATEGORIES,
    hero: HERO,
    clients: CLIENTS,
    reviews: REVIEWS,
    stylists: STYLISTS,
    feed: FEED,
    thread: THREAD,
    platform: PLATFORM,
  };
})();
