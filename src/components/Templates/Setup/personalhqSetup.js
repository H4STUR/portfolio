const PersonalHQSetup = {
  projectName: 'Personal HQ',
  publisher: 'Lucas Majerski',
  version: '9.2',
  tagline: "Private operating system for running a company. Built for one, by one.",
  banner: null,

  about:
    "Personal HQ is the private internal operating system I built to run Agares - one Laravel app where tasks, projects, clients, notes, decisions, reports, emails, AI agents, and marketplace data all live in the same place, under one auth, with one activity log.\n\n" +
    "The premise: Laravel stores the truth, n8n automates the actions, Ollama handles cheap local AI, Claude/OpenAI are optional premium providers, and any risky AI action lands in an Approval Queue for a human to greenlight before it runs. AI suggests; humans approve the dangerous bits.\n\n" +
    "Built across nine phases, 510 passing tests, AI org chart (departments, groups, @mentions in group chat), Approval Queue, scheduled reports with AI drafting, IMAP-synced email assistant, and an Allegro marketplace integration that read-syncs but never writes without explicit approval. Runs entirely on localhost - private, not public, and that's intentional.",

  highlights: [
    { number: '510', label: 'Tests passing across 9 phases' },
    { number: 'Private', label: 'Internal OS, never public-facing' },
    { number: 'Local AI', label: 'Ollama by default, Claude/OpenAI optional' },
    { number: 'Approval', label: 'Queue gates every risky AI action' },
  ],

  features: [
    {
      name: 'One Laravel app, every operations module',
      description:
        "Tasks (with subtasks + Kanban + comments), Projects, Clients, Notes, Decisions, Reports, Email Assistant, AI Runs, Approvals, Activity Log, Notifications, and Marketplace - all wired into a shared auth, shared sidebar, shared activity log, and shared notification bell. One place to look, one place to act.",
    },
    {
      name: 'AI org chart with departments, groups, @mentions',
      description:
        "Every AI agent has an avatar, a role, a department (with colour + icon), and a system prompt. Agents can be grouped into named teams. Group chat supports three modes - Auto (each agent decides if it should reply), Tagged-only (`@agent-slug` routing with keyboard-nav autocomplete), or Ask All - capped at 6 responses per message so nothing spirals.",
    },
    {
      name: 'Approval Queue safety layer',
      description:
        "Risky AI actions (send email, change Allegro price, publish/pause/end offers, send report) don't execute - they create an `ApprovalItem` with risk classification, payload preview, and reason codes. Execute is permanently blocked on external action types until a human-approved handler exists. Demonstrated end-to-end: safe actions execute on approve; risky ones approve but refuse to run.",
    },
    {
      name: 'Local-first AI via Ollama',
      description:
        "Default provider is Ollama on `localhost:11434` - chat, agent runs, report drafting, email classification all run on local models. `OllamaService` handles connection tests, model listing, chat (sync + streaming), and PHP `set_time_limit(300)` to dodge the 30-second default that would otherwise kill long inference. Cloud providers are optional - the system is fully usable offline.",
    },
    {
      name: 'n8n-friendly internal API',
      description:
        "Bearer-token-protected endpoints for tasks, approvals, reports, ecommerce, products, offers, orders, and Allegro sync. Every call writes an `AutomationLog` row. Duplicate-safe (e.g. same `external_order_id` per account returns `200 skipped:true`). Pairs with an n8n instance for scheduling, webhooks, and cross-system glue.",
    },
    {
      name: 'Email Assistant - IMAP sync + AI triage',
      description:
        "Pure-PHP IMAP client (no `ext-imap` needed - PHP 8.4 compatible). Scheduled `hq:sync-emails` every 30 min, per-account isolated so one bad account doesn't break the others. Each email gets AI-classified by importance + intent; high/urgent ones trigger notifications. One click promotes an email to a task, a note, or a draft reply - which itself becomes an Approval Queue entry before anything actually sends.",
    },
    {
      name: 'Reports with AI drafting + scheduling',
      description:
        "Eight report types (daily, weekly, project, task, AI activity, automation, approval, ecommerce) generated from live DB data with no AI dependency. On top of that, 7 AI draft variants (summary, executive summary, client-ready, internal, action items, custom) - the original report isn't overwritten until you explicitly Accept a draft. Laravel scheduler runs daily 18:00 and weekly Friday 17:00, with duplicate-skip and `--force` regenerate.",
    },
    {
      name: 'Allegro marketplace integration (read-only + insights)',
      description:
        "Real Allegro OAuth flow, encrypted token storage (`encrypted` cast + APP_KEY-derived AES), read-only sync of offers + orders. A `MarketplaceIntelligenceService` runs 8 detectors (low stock, error offers, no-margin, stale sync, no-sales accounts, etc.) and surfaces them in two attention pages with reason badges. Every risky write (price change, publish, pause, end offer) is approval-gated and currently non-executable - safety contract by design.",
    },
    {
      name: 'Claude Code CLI alongside the web UI',
      description:
        "Six Artisan commands (`hq:create-task`, `hq:create-note`, `hq:log-decision`, `hq:list-tasks`, `hq:today`, `hq:project-summary`) operate on the same DB the web UI uses. Plus a `CLAUDE.md` at repo root that documents trigger phrases, options, and safety rules - so Claude Code is a real coworker on the project, not just a chat window.",
    },
  ],

  techStack: [
    { name: 'Laravel 13 + PHP 8.4', reason: "Modern Laravel - `HasMiddleware`, scheduler facade, encrypted casts, AppServiceProvider gates. Same family as the rest of the Agares stack." },
    { name: 'PostgreSQL', reason: "Same DB engine I'm pushing toward across all Agares projects. Forward-compatible with pgvector if RAG features land here later." },
    { name: 'Ollama\n(default AI provider)', reason: "Local LLM. `llama3.2` for chat/agents, configurable per-provider. Cloud providers are pluggable, not required." },
    { name: 'n8n', reason: "Runs alongside HQ as the automation engine - schedulers, webhooks, cross-system actions. HQ exposes the internal API; n8n drives the workflows." },
    { name: 'Spatie Permissions +\nLaravel Breeze', reason: "Admin RBAC with super_admin role; Breeze for auth scaffold. Public registration disabled - this is private from day one." },
    { name: 'Bootstrap 5 + Blade', reason: "Server-rendered admin shell with dark theme default. Same UI vocabulary as Agares CMS and SaaS - looks like one family of tools." },
    { name: 'Pure-PHP IMAP client', reason: "`stream_socket_client` + RFC 822/2822/MIME parsing - sidesteps the PHP `imap` extension which doesn't build cleanly on 8.4. Means HQ runs on any modern PHP install." },
    { name: 'PHPUnit\n(510 tests)', reason: "TDD discipline across every phase - enum unit tests, controller feature tests, service unit tests. Lets phases land without breaking earlier ones." },
    { name: 'Laravel Scheduler\n+ DirectAdmin cron', reason: "Daily report draft at 18:00, weekly Friday at 17:00, IMAP sync every 30 min - all `withoutOverlapping()` + `runInBackground()`. Production cron one-liner drives `schedule:run`." },
    { name: 'Claude Code\n(co-developer)', reason: "Repo-root `CLAUDE.md` documents commands, behaviour, and safety rules. Claude Code is treated as a coworker that ships features alongside me, not as a chat assistant." },
  ],

  screenshots: [],

  finish: {
    title: 'Private by design',
    subtitle: 'Runs on my machine, not on the internet',
    text:
      "That's the tour. Personal HQ lives on localhost:8000 and isn't deployed publicly - it's a private internal operating system, built first to validate workflows before any hosted version exists.\n\n" +
      "You can't visit it, but the patterns prototyped here show up across the rest of the Agares stack - the Approval Queue, the AI agent abstraction, the n8n-friendly internal API, the Ollama-first AI integration. Personal HQ is where the architecture gets stress-tested first, then ports outward into Agares CMS, Agares SaaS, and Cookie Scanner.",
  },

  links: {
    demo: null,
    repo: null,
  },
};

export default PersonalHQSetup;
