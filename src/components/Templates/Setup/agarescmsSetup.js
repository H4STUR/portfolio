const AgaresCMSSetup = {
  projectName: 'Agares CMS',
  publisher: 'Lucas Majerski',
  version: '2026.1',
  tagline: 'A full-stack, multi-site, SaaS-grade CMS - built from scratch.',
  banner: 'agares_cms_dashboard.jpg',

  about:
    'Agares CMS is a custom-built multi-site content platform - one admin dashboard that runs an unlimited number of client websites, each with its own content tree, theme, ecommerce module, newsletter system, and granular access control.\n\n' +
    "It's not a WordPress clone. Every system - content modelling, permissions, payments, newsletter delegation, REST API - was designed and written from the ground up to fix the specific pain points that keep biting clients on off-the-shelf platforms.\n\n" +
    'Still actively developed. I use it as the base for my own side projects and as the engine behind commercial client websites - the same codebase ships to both. Forum and reservation/booking modules are next on the roadmap.',

  highlights: [
    { number: '4', label: 'Payment gateways integrated' },
    { number: '119', label: 'Tests passing, security-audited' },
    { number: '17', label: 'Newsletter permissions in granular RBAC' },
    { number: '∞', label: 'Sites managed per install' },
  ],

  features: [
    {
      name: 'Multi-site architecture',
      description:
        'One admin manages unlimited websites. Each site has its own content tree, theme, settings, and users - no separate installs, no shared content leakage.',
    },
    {
      name: 'Polymorphic content modelling',
      description:
        'Build any content shape - events, products, recipes, listings - without writing migrations. Custom fields are real, indexed database rows, not JSON blobs.',
    },
    {
      name: 'Built-in blogging engine',
      description:
        'Articles, categories, tags, scheduled publishing, drafts, SEO metadata per post. Same content engine that powers the rest of the CMS - no separate "blog plugin" duct-taped on top.',
    },
    {
      name: 'Full ecommerce module',
      description:
        'Products, variants, stock, orders, taxes, coupons, shipping zones, four payment gateways. Feature-flagged off entirely for clients who don\'t need it.',
    },
    {
      name: 'Newsletter system with SaaS delegation',
      description:
        'Lists, templates, draft campaigns, GDPR consent capture. Bulk sending delegated over HMAC-signed API to an external SaaS - so the CMS runs on $5 shared hosting with no queue workers.',
    },
    {
      name: 'Granular role-based access',
      description:
        'Spatie permissions with route + controller defense-in-depth. Six roles, every mutation gated. Read-only demo mode for prospective clients to click around safely.',
    },
    {
      name: 'REST API with scoped API keys',
      description:
        'Versioned at `/api/v1` with per-key abilities (content:read, preview:read, media:read). Powers headless frontends and third-party integrations.',
    },
    {
      name: 'Cookie consent + GDPR compliance',
      description:
        'Per-category cookie scanner, consent snapshots stored against subscribers (text, IP, user-agent). Built to actually pass a legal audit.',
    },
    {
      name: 'GitHub Actions auto-deploy',
      description:
        'Push to a branch, deploys to that branch\'s domain. SFTP package, post-deploy migrate, never overwrites uploads.',
    },
  ],

  techStack: [
    { name: 'Laravel 13 + PHP 8.3', reason: 'Battle-tested backend on the latest LTS-grade release for security and features.' },
    { name: 'MySQL 8 + Docker', reason: 'Production-grade data layer; reproducible dev environment across machines.' },
    { name: 'Vite 5 + Tailwind 3', reason: 'Sub-second HMR; utility CSS keeps the admin fast and consistent.' },
    { name: 'Bootstrap 5.3 + Alpine.js 3', reason: 'Polished admin shell with a light reactive layer - no SPA tax.' },
    { name: 'Monaco Editor', reason: "VS Code's editor embedded for per-page custom code editing." },
    { name: 'TinyMCE 6', reason: 'WYSIWYG with a safe-HTML pipeline and gallery picker integration.' },
    { name: 'Spatie Permissions', reason: 'Industry-standard RBAC, hardened with route + controller gates.' },
    { name: 'Stripe / PayU / P24 / PayPal', reason: 'Polish market needs PayU + P24; Stripe + PayPal for international.' },
  ],

  screenshots: [
    { file: 'agares_cms_dashboard.jpg', caption: 'Admin dashboard - live stats, GA4 integration, recent activity at a glance.' },
    { file: 'agares_cms_sites.jpg', caption: 'Multi-site selector - every client website managed from one place.' },
    { file: 'agares_cms_edit.jpg', caption: 'Content editor with TinyMCE, custom field support, scheduling, drafts.' },
    { file: 'agares_cms_menus.jpg', caption: 'Drag-and-drop menu builder. Multi-level navigation, per-site.' },
    { file: 'agares_cms_media.jpg', caption: 'Media library - bulk upload, MIME allowlist, gallery picker, image transforms.' },
    { file: 'agares_cms_cookies.jpg', caption: 'Cookie consent manager - per-category, GDPR-compliant, auditable.' },
    { file: 'agares_cms_settings.jpg', caption: 'Site-scoped settings - SEO, analytics, integrations, feature flags.' },
  ],

  links: {
    demo: { label: 'Visit the live demo at demo.agares.co.uk', url: 'https://demo.agares.co.uk' },
    repo: null,
  },
};

export default AgaresCMSSetup;
