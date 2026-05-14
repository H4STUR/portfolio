const BenderSetup = {
  projectName: 'Bender',
  publisher: 'Lucas Majerski',
  version: '1.0',
  tagline: 'Adult party game for the web. Three flavours of chaos.',
  banner: 'bender_home.jpg',

  about:
    'Bender is a browser-based party game for groups - three mini-games served from a custom backend, with a spiciness slider, category filters, and a card-flip UI built for fast tapping around a table.\n\n' +
    "Full-stack solo project: React + TypeScript frontend on bender-app.eu, separate Laravel 11 API on its own subdomain serving the content. The two repos talk over HTTP; an admin panel on the API side lets me add/edit categories and questions without redeploying the frontend.\n\n" +
    "Live in production. SEO landing pages bypass the 18+ age gate so search crawlers can actually index the thing - players hit the gate the first time they try to play.",

  highlights: [
    { number: '3', label: 'Mini-games in one app' },
    { number: '5', label: 'Levels of spiciness slider' },
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
      name: 'Custom Laravel 11 backend',
      description:
        'Separate repo serving content via REST. Spatie permissions gate the admin panel - I can edit categories, questions, and review reports without touching the frontend.',
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
    { name: 'Laravel 11 + PHP 8.2', reason: 'Content API + admin panel. Same stack family as the rest of my projects.' },
    { name: 'MySQL + Docker', reason: 'Reproducible local dev; same DB engine as production.' },
    { name: 'Spatie Permissions', reason: 'Role-based access on the admin panel so contributors can edit content without root.' },
    { name: 'Google Analytics 4', reason: 'Prod-only telemetry on which mini-games get played and where players drop off.' },
  ],

  screenshots: [
    { file: 'bender_home.jpg', caption: 'Home screen - pick a mini-game. Card-style entry tiles, age-gated route.' },
    { file: 'bender_nhie.jpg', caption: 'Never Have I Ever in play - card-flip UI, spiciness already dialled in, report button on every card.' },
  ],

  links: {
    demo: { label: 'Play it live at bender-app.eu', url: 'https://bender-app.eu/' },
    repo: null,
  },
};

export default BenderSetup;
