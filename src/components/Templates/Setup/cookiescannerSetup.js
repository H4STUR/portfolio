const CookieScannerSetup = {
  projectName: 'Cookie Scanner',
  publisher: 'Lucas Majerski',
  version: '1.1',
  tagline: 'Headless microservice that audits any website for GDPR/CCPA compliance.',
  banner: 'saas-cookies.jpg',

  about:
    "Cookie Scanner is a stateless Node.js microservice that visits any URL, drives a real headless Chromium through the page, auto-clicks the consent banner, and reports back every cookie, localStorage entry, and tracking script it spots - with a GDPR/CCPA-friendly privacy grade attached.\n\n" +
    "It's the bottom layer of a 3-tier architecture I built end-to-end: the scanner itself, the Agares SaaS that wraps it with tenant API keys + async job queue + admin UI + scan history, and an Agares CMS plugin that lets client sites trigger scans through scoped `agr_` keys without ever seeing the microservice directly. The scanner is deliberately backend-only - no users, no auth state, no history. All of that belongs in the SaaS.\n\n" +
    "Live in production, internal-only behind 127.0.0.1, managed by PM2, auto-deployed via GitHub Actions. Open source on GitHub if you want to read the code or run your own instance.",

  highlights: [
    { number: '3', label: 'Tier architecture (microservice → SaaS → CMS)' },
    { number: 'A-F', label: 'Privacy compliance grading' },
    { number: '0', label: 'Cookie values stored (metadata only)' },
    { number: '45s', label: 'Hard scan timeout' },
  ],

  features: [
    {
      name: 'Stateless single-endpoint design',
      description:
        "One POST endpoint: `/api/scan` takes a URL, returns structured results. No database, no auth state, no scan history. All of that belongs upstream in the SaaS - the scanner does one job.",
    },
    {
      name: 'Wired into Agares SaaS as a tenant service',
      description:
        "Agares SaaS wraps the scanner with async Laravel jobs, per-tenant scan history, and `agr_` API keys scoped to `cookie_scanner` + `allowed_domains`. Tenants of the SaaS get a fully managed scanning service - the microservice just executes.",
    },
    {
      name: 'Exposed to Agares CMS via scoped API key',
      description:
        "Agares CMS calls `POST /api/v1/services/cookie-scanner/scan` on the SaaS with an `agr_` bearer key. Two-tier auth: the SaaS authenticates tenants by their `agr_` key; the SaaS authenticates itself to the scanner via an internal shared secret. Tenants never see the microservice directly.",
    },
    {
      name: 'Real headless Chromium, not a parser',
      description:
        'Uses puppeteer-core + @sparticuz/chromium so a statically-linked Chromium runs even on shared hosting without system libraries. Pages execute their JavaScript, set their cookies, fire their trackers - then we observe what actually happened.',
    },
    {
      name: 'Auto-consent handling (EN + PL)',
      description:
        'Clicks the cookie banner the way a user would. Tries `#cc-accept` ID first (most stable), then falls back to text matching across English and Polish variants. Catches the post-consent wave of cookies that lazy scanners miss.',
    },
    {
      name: 'Tracker + network detection',
      description:
        'Sniffs for the usual suspects in-page (gtag, fbq, hj, Hotjar, Meta Pixel) plus tracks every request hostname Chromium fires - so third-party network trackers without a JS handle still show up.',
    },
    {
      name: 'Privacy-respecting by default',
      description:
        'Cookie values are never stored. Only metadata - name, domain, path, expiry, duration, session-flag, category. Means scan output can be safely logged, shared with tenants, and stored in the SaaS without leaking session tokens.',
    },
    {
      name: 'Privacy score + compliance notes',
      description:
        'Every scan gets a privacy grade A through F based on what was found, plus human-readable notes mapping cookies and trackers to GDPR / CCPA categories. The SaaS renders these in its admin UI and the CMS plugin shows them to the site owner.',
    },
    {
      name: 'Concurrency-controlled & bounded',
      description:
        "Max 3 parallel scans - returns 429 when at capacity. Hard 45-second timeout per scan. Won't take the host down if a target page hangs.",
    },
    {
      name: 'CI/CD + PM2 zero-downtime',
      description:
        'Push to `main` triggers GitHub Actions: SFTP package, `npm install --omit=dev`, `pm2 reload`. Survives deploys without dropping in-flight scans.',
    },
  ],

  techStack: [
    { name: 'Node.js + Express 4', reason: 'Lean HTTP layer. No need for a heavier framework on a single-endpoint service.' },
    { name: 'puppeteer-core +\n@sparticuz/chromium', reason: "Statically-linked Chromium that runs without `libatk-bridge` and friends - critical for shared hosting." },
    { name: 'pino', reason: 'Structured JSON logging - feeds straight into log aggregation without parsing.' },
    { name: 'Docker', reason: 'Reproducible local dev; same image works for CI sanity checks.' },
    { name: 'PM2', reason: 'Process manager that survives deploys via `pm2 reload` - zero-downtime restarts.' },
    { name: 'GitHub Actions', reason: 'SFTP + SSH deploy pipeline. Same pattern as the rest of my Agares infrastructure.' },
    { name: 'X-Internal-Secret auth', reason: "No JWT theatre at the internal service layer - one shared secret in an env var is enough when the only caller is my own SaaS." },
    { name: '127.0.0.1 bind', reason: 'Unreachable from outside the host even if the firewall is misconfigured. The SaaS calls it over the loopback interface.' },
    { name: 'Agares SaaS wrapper\n(Laravel 13 + PostgreSQL)', reason: 'Adds tenant auth, scoped `agr_` API keys, async job queue, per-tenant scan history, admin UI - all the stateful concerns the microservice deliberately skips.' },
  ],

  screenshots: [
    { file: 'saas-cookies.jpg', caption: 'Agares SaaS — Cookie Scanner service panel: trigger scans per tenant, scan history with status, grade, and cookie/tracker counts.' },
    { file: 'agares_cms_cookies.jpg', caption: 'Agares CMS — Cookie & GDPR module: SaaS scanner integration, consent configuration, and scan history for a client site.' },
  ],

  links: {
    demo: { label: 'View source on GitHub', url: 'https://github.com/H4STUR/cookie-scanner' },
    repo: null,
  },
};

export default CookieScannerSetup;
