const PiesCiMordeLizalSetup = {
  projectName: 'PiesCiMordeLizal',
  publisher: 'Lucas Majerski',
  version: '1.0',
  tagline: 'Live commercial website. First real-world deployment of Agares CMS.',
  banner: null,

  about:
    "PiesCiMordeLizal.pl is a live commercial website for a Polish dog-services brand - and the first real-world validation of Agares CMS in a paying-client context.\n\n" +
    "The site went live in early 2026 and the client has been managing all their own content through the CMS admin panel ever since: pages, articles, media, menus, settings. My job after handover has been keeping the engine running - the editorial side has been entirely self-served, which is exactly the bar I built the CMS for.\n\n" +
    "This deployment also drove improvements back into the platform - the Polish cookie-consent detection in the [Cookie Scanner](#) microservice was partly developed against this site's consent banner.",

  highlights: [
    { number: '01.2026', label: 'Launched and live' },
    { number: 'PL', label: 'Polish-market site' },
    { number: '1st', label: 'Commercial deployment of Agares CMS' },
    { number: '0', label: 'Dev emails to add a page' },
  ],

  features: [
    {
      name: 'First commercial deployment of Agares CMS',
      description:
        "Proved the platform end-to-end in a real paying-client context - everything from initial content modelling to client handover to ongoing self-service editorial. The same admin you see on Agares CMS Setup.exe is what the dog-services owner uses every week.",
    },
    {
      name: 'Client-managed editorial workflow',
      description:
        "After handover the client manages all content directly - pages, articles, images, menus. Zero 'can you add a page' emails to me. That self-service bar was the whole point of building the CMS.",
    },
    {
      name: 'Polish-market validation',
      description:
        "Drove Polish-specific improvements back into the Agares stack: cookie-consent banner variants now detected by the standalone Cookie Scanner microservice, locale handling in the CMS admin, GDPR consent text patterns.",
    },
    {
      name: 'GDPR-compliant out of the box',
      description:
        "The site inherits the full CMS cookie-consent pipeline - per-category cookie management, consent snapshots stored against subscribers (text, IP, user-agent), and the privacy-policy / cookie-policy pages all rendered from the CMS.",
    },
    {
      name: 'Same Sites → Categories → Articles model',
      description:
        "Standard Agares CMS instance. Multi-site capable, custom fields available if needed, scheduled publishing, drafts - the client doesn't use half of what's on offer, which is also the point. The CMS scales down to a simple site cleanly.",
    },
    {
      name: 'Same deploy pipeline as the rest of the stack',
      description:
        "GitHub Actions on push to branch → SFTP rsync → post-deploy `migrate --force` → cache rebuilds. `public/uploads/` and `.env` never touched. Identical workflow shape to Agares SaaS and the Cookie Scanner microservice.",
    },
  ],

  techStack: [
    { name: 'Agares CMS\n(Laravel 11 + MySQL)', reason: "The site runs entirely on Agares CMS - my own multi-site content platform. See Custom CMS Setup.exe for the full breakdown." },
    { name: 'MySQL 8 + Docker', reason: "Same DB engine and reproducible dev environment as the rest of the Agares CMS sites." },
    { name: 'TinyMCE 6', reason: "The actual WYSIWYG the client uses every week to write content. Safe-HTML sanitised on save." },
    { name: 'Vite + Tailwind 3 +\nBootstrap 5', reason: "Inherited from Agares CMS - same admin shell across every site." },
    { name: 'Cookie consent\n(GDPR-compliant)', reason: "Per-category cookie management built into the CMS - consent text, IP, user-agent snapshotted for every opt-in. Polish consent variants tested live on this site." },
    { name: 'GitHub Actions\n(SFTP + SSH deploy)', reason: "Push to a branch, deploys to that branch's domain. Same pipeline pattern as Agares CMS, Cookie Scanner, and Agares SaaS." },
  ],

  screenshots: [],

  links: {
    demo: { label: 'Visit the live site at piescimordelizal.pl', url: 'https://piescimordelizal.pl' },
    repo: null,
  },
};

export default PiesCiMordeLizalSetup;
