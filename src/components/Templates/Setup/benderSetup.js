const BenderSetup = {
  projectName: 'Bender',
  publisher: 'Lucas Majerski',
  version: '1.0',
  tagline: 'Adult party game for the web. Three flavours of chaos.',
  banner: 'bender_home_raw.jpg',

  about:
    'Bender is a browser-based party game for groups - three mini-games served from a custom backend, with a spiciness slider, category filters, and a card-flip UI built for fast tapping around a table.\n\n' +
    "Full-stack solo project: React + TypeScript frontend on bender-app.eu, separate Laravel 13 API (PHP 8.4) on panel.bender.agares.co.uk serving the content. The API is versioned at /api/v1/ and gated by a master API key; an admin panel lets me manage categories, questions, the pending moderation queue, and reported cards without redeploying the frontend.\n\n" +
    "Live in production. SEO landing pages bypass the 18+ age gate so search crawlers can actually index the thing - players hit the gate the first time they try to play.",

  highlights: [
    { number: '3', label: 'Mini-games in one app' },
    { number: '1269', label: 'Cards across all games' },
    { number: '2', label: 'Repos: frontend + API' },
    { number: '18+', label: 'Age-gated, GA4-instrumented' },
  ],

  features: [
    {
      name: 'Three mini-games in one app',
      description:
        'Never Have I Ever, Truth or Dare, and Quiz - each with its own deck, scoring, and pacing. All share a card-flip UI pattern so the controls feel consistent across modes.',
    },
    {
      name: 'Spiciness slider + category filters',
      description:
        'Players dial intensity from 1 to 5 and toggle categories on/off before they start. The deck is filtered server-side so the frontend never sees questions you opted out of.',
    },
    {
      name: 'Card-flip UI built for taps',
      description:
        '600ms CSS transitions, useRef-managed deck so rapid double-taps never race-condition into duplicate cards or skipped ones. Designed for phones being passed around a table.',
    },
    {
      name: 'Smart age gate',
      description:
        "18+ confirmation stored as `bender_age_ok_v1` in localStorage. Decline and you get redirected to `about:blank`. SEO landing pages bypass the gate entirely so Google can crawl - players still hit it on the play routes.",
    },
    {
      name: 'No-repeat deck per session',
      description:
        'Used question IDs persist in localStorage per game, so the deck never repeats cards within a session. Clears when the deck is exhausted - then it reshuffles fresh.',
    },
    {
      name: 'Report-a-card flow',
      description:
        'Every card has a report button. Reports flow to the Laravel API where the admin panel surfaces them for moderation, edit, or removal without a redeploy.',
    },
    {
      name: 'Custom Laravel 13 API backend',
      description:
        'Separate repo on panel.bender.agares.co.uk serving content via REST at /api/v1/. Master-key auth (static BENDER_API_KEY, hash_equals compare) keeps it simple — one legitimate client today. ' +
        'Admin panel for categories, questions, pending moderation queue, and reported cards. Spatie permissions gate admin access. Report deduplication: same item + reason + status=new increments the count instead of creating duplicates.',
    },
    {
      name: 'Semantic duplicate detection',
      description:
        'A tiered pipeline keeps 1269 cards from becoming bloated with near-duplicates as the deck grows. ' +
        'Hash matching catches exact copies instantly; trigram similarity filters close textual variants; ' +
        'pgvector embedding search (Ollama, same stack as Agares SaaS) catches semantically identical cards phrased differently. ' +
        'Results above 0.92 similarity are auto-rejected; the 0.80–0.92 band is flagged for admin review; below 0.80 passes straight through.',
    },
    {
      name: 'GA4 with prod/dev split',
      description:
        'Two separate GA4 measurement IDs - analytics fire in production only, disabled on localhost. Real funnel data on which mini-game gets opened, played, and abandoned.',
    },
  ],

  techStack: [
    { name: 'React 18 + TypeScript', reason: 'Type safety on a UI with branching state per mini-game.' },
    { name: 'Vite (SWC)', reason: 'Sub-second HMR; SWC over Babel for faster TS compilation.' },
    { name: 'React Router DOM v6', reason: 'Separate `/play` routes from SEO landing pages so crawlers index without hitting the age gate.' },
    { name: 'styled-components', reason: 'Scoped styles per component - no global CSS bleed across the three mini-games.' },
    { name: 'React Helmet Async', reason: 'Per-route meta tags and OG cards for each mini-game landing page.' },
    { name: 'Axios', reason: 'API calls to the Laravel backend with a configurable base URL.' },
    { name: 'Laravel 13 + PHP 8.4', reason: 'Content API + admin panel. Upgraded from Laravel 11 to stay on the same major version as the rest of the Agares stack.' },
    { name: 'PostgreSQL + pgvector\n+ Docker', reason: 'Migrated from MySQL. pgvector enables semantic similarity search for the duplicate-detection pipeline.' },
    { name: 'Spatie Permissions', reason: 'Role-based access on the admin panel so contributors can edit content without root.' },
    { name: 'Google Analytics 4', reason: 'Prod-only telemetry on which mini-games get played and where players drop off.' },
  ],

  screenshots: [
    { file: 'bender_landing_raw.jpg', caption: 'Landing page — SEO-friendly intro, bypasses the age gate so crawlers can index it.' },
    { file: 'bender_home_raw.jpg', caption: 'Home screen — three mini-games, three more in progress. Dark neon UI, mobile-first layout.' },
    { file: 'bender_nhie_raw.jpg', caption: 'Never Have I Ever — card drawn, category and spiciness shown at the bottom. 375 cards in the deck.' },
    { file: 'bender_nhie_card_raw.jpg', caption: 'NHIE card — flipped view showing question text, category, and spiciness level.' },
    { file: 'bender_tod_raw.jpg', caption: 'Truth or Dare — dual-card layout, Truth drawn with category and penalty, Dare waiting for a tap.' },
    { file: 'bender_admin_raw.jpg', caption: 'Bender Admin — Laravel dashboard showing total question counts per game mode.' },
    { file: 'bender_admin_questions_raw.jpg', caption: 'Question manager — add, search, categorise and set spiciness on any card without redeploying.' },
  ],

  links: {
    demo: { label: 'Play it live at bender-app.eu', url: 'https://bender-app.eu/' },
    repo: null,
  },
};

export default BenderSetup;
