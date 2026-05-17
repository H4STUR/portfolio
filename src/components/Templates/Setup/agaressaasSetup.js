const AgaresSaaSSetup = {
  projectName: 'Agares SaaS',
  publisher: 'Lucas Majerski',
  version: '2026.1',
  tagline: 'Multi-tenant AI platform. The spine that powers everything else.',
  banner: 'saas-dashboard.jpg',

  about:
    "Agares SaaS is the multi-tenant AI platform that hosts everything else I've built - Cookie Scanner, AI Chat, RAG, and Newsletter - and exposes them as managed services to my own products (Agares CMS) and third-party callers via scoped `agr_` API keys.\n\n" +
    "Tenants get their own data isolation, their own AI agents backed by RAG knowledge bases, their own API keys with per-service scopes and per-domain allow-lists. Every service request flows through a unified quota + logging pipeline, so usage is audited and capped without code drift between services.\n\n" +
    "Live in production at api.agares.co.uk, actively developed. Built on Laravel 13 + PostgreSQL with pgvector for the RAG layer.",

  highlights: [
    { number: '5', label: 'Services hosted (Cookies, AI Chat, RAG, Newsletter, AI SEO)' },
    { number: '∞', label: 'Tenants per install' },
    { number: '1536', label: 'pgvector embedding dimensions' },
    { number: 'agr_', label: 'Scoped tenant API key prefix' },
  ],

  features: [
    {
      name: 'Multi-tenant from day one',
      description:
        "Every entity - users, agents, knowledge bases, documents, scans, campaigns, API keys - is scoped to a tenant. Cross-tenant access returns 404, not 403, so attackers can't even confirm a record exists. Soft-deletes everywhere; production data never disappears.",
    },
    {
      name: '`agr_` scoped API keys',
      description:
        "60-char bearer tokens (`agr_` + 56 hex). Each key carries `scopes` (which services it can call) and `allowed_domains` / `allowed_origins` (which sites it can act on). Stored as SHA-256 hash + prefix only - the plain key is shown once, then never again.",
    },
    {
      name: 'Agent-aware AI chat',
      description:
        "`POST /api/v1/chat` with an `agent_id` + messages. Server prepends the agent's `system_prompt` - clients can't override it, the model, the provider, or the temperature. Pre-flight token estimate enforces quotas before the model is even called.",
    },
    {
      name: 'RAG via pgvector',
      description:
        'Knowledge bases store document chunks as `vector(1536)` columns with an HNSW index using cosine similarity. Embeddings written via raw SQL. Tenants attach knowledge bases to agents many-to-many - one KB can power multiple agents, one agent can pull from multiple KBs.',
    },
    {
      name: 'Cookie scanner as a managed tenant service',
      description:
        'Wraps the standalone scanner microservice with async Laravel jobs, per-tenant scan history, retries, and an admin UI. Tenants of the SaaS get a fully managed scanning service - the microservice just executes scans, the SaaS owns everything else.',
    },
    {
      name: 'Newsletter engine with queued bulk send',
      description:
        'Tenants delegate campaigns over the API; SaaS dedupes, suppression-filters, snapshots the recipient list, and dispatches a `newsletter` queue. ' +
        'Atomic counters, idempotent per-recipient sends, HMAC-SHA256-signed callback webhooks on status transitions. ' +
        'RFC 8058 one-click unsubscribe headers, per-tenant sender identity table with SPF/DMARC/DKIM auto-verification via DNS, ' +
        'bounce mailbox IMAP parsing (hard/soft DSN classification → auto-suppression), per-minute/per-hour rate limiting, ' +
        'and provider inbound webhook handlers for bounce and complaint events.',
    },
    {
      name: 'AI SEO Generator',
      description:
        'POST /api/v1/services/ai-seo/generate — produces meta_title (≤60 chars), meta_description (≤160 chars), slug, og_title, og_description, schema_jsonld, and image_alt from content sent by the CMS. ' +
        'CMS strips HTML and sends ≤2000 chars so the SaaS stays content-type-agnostic — the same endpoint will serve a future WordPress plugin. ' +
        'Per-API-key model override via api_keys.service_settings; output validator with one retry on overflow; real token counts from Ollama.',
    },
    {
      name: 'Service catalog with usage tracking & quotas',
      description:
        'Per-tenant enable/disable for every service. Daily and monthly limits stored per `(tenant, service, period)`. Every service request logged immutably to `service_usage_logs` (success / failed / throttled). 429 returned on overage - tenants see real-time usage on their dashboard.',
    },
    {
      name: 'Three-layer auth',
      description:
        'Global: Spatie `super_admin` role + `is_super_admin` bypass. Per-tenant: a `TenantUser.role` enum (`owner` / `admin` / `member`) gated by Laravel `Gate::before`. External: a custom `ApiKeyAuthenticate` middleware that resolves `agr_` bearers to tenants. Sanctum on top for admin web sessions.',
    },
    {
      name: 'Provider-agnostic AI execution',
      description:
        '`ai_providers` table is the source of truth - Ollama seeded as default, OpenAI/Anthropic next. New providers slot in by registering a driver class - no schema changes, no controller churn. `ChatExecutor` is the single pipeline used by both the public API and the in-app tenant chat panel.',
    },
    {
      name: 'Actions + DTOs + Form Requests',
      description:
        'Thin controllers, business logic in `app/Actions/*`, validation in Form Requests, payloads as typed DTOs. Every Action is unit-testable in isolation - no controller mocking needed.',
    },
  ],

  techStack: [
    { name: 'Laravel 13 + PHP 8.3', reason: 'Modern Laravel - HasMiddleware on controllers, AppServiceProvider Gate registration, the works.' },
    { name: 'PostgreSQL + pgvector', reason: 'Chosen specifically for pgvector. MySQL was a non-starter the moment RAG entered the roadmap.' },
    { name: 'Ollama\n(provider-abstracted)', reason: 'Local LLM by default; the abstraction means swapping to OpenAI / Anthropic is a driver class, not a rewrite.' },
    { name: 'Spatie Permissions', reason: 'Industry-standard RBAC for the global `super_admin` role + named gates. Tenant roles stay outside Spatie - they\'re contextual, not global.' },
    { name: 'Sanctum + custom\n`agr_` middleware', reason: 'Sanctum guards the admin web app; `ApiKeyAuthenticate` middleware handles tenant-scoped external service tokens. Two auth surfaces, one Laravel.' },
    { name: 'Docker', reason: 'Local dev parity with production Postgres + pgvector. No "works on my machine" with vector ops.' },
    { name: 'Laravel queues\n(database driver)', reason: 'Async cookie scans and newsletter bulk send. Dedicated `newsletter` queue keeps email throughput from blocking interactive jobs.' },
    { name: 'DirectAdmin cron', reason: 'Drives `php artisan queue:work` every minute in production - no Supervisor needed on shared hosting.' },
    { name: 'Vite + Bootstrap 5', reason: 'Admin + tenant panel UI. Lean asset pipeline, server-rendered Blade where it makes sense.' },
    { name: 'GitHub Actions', reason: 'SFTP + SSH deploy with `queue:restart` post-deploy signal. Same pipeline shape as the Cookie Scanner and CMS deployments.' },
  ],

  screenshots: [
    { file: 'saas-dashboard.jpg', caption: 'Platform dashboard — tenant/service overview, sidebar split between Platform, Services, and Workspace.' },
    { file: 'saas-tenants.jpg', caption: 'Tenants — client accounts with member counts, agent counts, and knowledge base counts at a glance.' },
    { file: 'saas-rag.jpg', caption: 'RAG Chat service — 3-step pipeline overview (Ingest → Configure → Query) with technical spec panel.' },
    { file: 'saas-agents.jpg', caption: 'Agents — per-tenant chatbot agents with active/inactive status and knowledge base assignments.' },
    { file: 'saas-cookies.jpg', caption: 'Cookie Scanner — trigger scans per tenant, scan history with status, grade, and cookie/tracker counts.' },
  ],

  links: {
    demo: { label: 'Live deployment at api.agares.co.uk', url: 'https://www.api.agares.co.uk/' },
    repo: null,
  },
};

export default AgaresSaaSSetup;
