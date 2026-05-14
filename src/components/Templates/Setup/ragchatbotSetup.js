const RAGChatbotSetup = {
  projectName: 'RAG Chatbot',
  publisher: 'Lucas Majerski',
  version: '0.9',
  tagline: 'Local-first Retrieval-Augmented Generation. Zero cloud API calls.',
  banner: null,

  about:
    "RAG Chatbot is a fully local Retrieval-Augmented Generation pipeline: upload a PDF, ask a question, get a streaming answer that's grounded in the document - all running on your machine, with zero external API calls.\n\n" +
    "End-to-end Laravel app on top of Postgres + pgvector + Ollama. PDFs come in, get chunked, get embedded with `embeddinggemma` (768-dim), and stored as pgvector rows. Questions get embedded the same way, searched by L2 distance, and the top chunks are streamed back through `llama3.2` token-by-token over NDJSON.\n\n" +
    "Built as a proof of concept and as the foundation for the RAG service that's queued for integration into Agares SaaS - the existing pipeline lifts cleanly into the multi-tenant `knowledge_bases → documents → document_chunks (vector(1536))` schema already waiting there.",

  highlights: [
    { number: '0', label: 'Cloud API calls (fully local Ollama)' },
    { number: '768', label: 'Embedding dimensions (embeddinggemma)' },
    { number: 'NDJSON', label: 'Streaming response protocol' },
    { number: 'Top-3', label: 'pgvector L2 retrieval default' },
  ],

  features: [
    {
      name: 'Fully local, fully private',
      description:
        "No OpenAI, no Anthropic, no API keys, no telemetry. Embeddings, retrieval, generation - all on the same machine via Ollama. Sensitive PDFs never leave the host.",
    },
    {
      name: 'PDF in, streaming answer out',
      description:
        "`POST /api/documents` ingests a PDF via `smalot/pdfparser`; `GET /api/documents/{id}/process` chunks + embeds in one step; `POST /api/ask` embeds the question, searches pgvector, and streams the generated answer back token-by-token.",
    },
    {
      name: 'pgvector retrieval with L2 distance',
      description:
        "Chunks stored as `vector(768)` rows; the question's embedding is matched with pgvector's `<->` operator (L2). Top-K (default 3) chunks are concatenated into the prompt up to a configurable max-context budget.",
    },
    {
      name: 'NDJSON streaming protocol',
      description:
        "`/api/ask` returns `application/x-ndjson` with three event kinds: `sources` (which chunks matched + timings), `token` (one per streamed model output), and `done` (final timing). Frontends can render answers as they generate.",
    },
    {
      name: 'Pure-PHP ingestion',
      description:
        "PDF text extraction via `smalot/pdfparser` - no Python sidecar, no external service. Lets the whole pipeline live inside one Laravel container.",
    },
    {
      name: 'Configurable retrieval budget',
      description:
        "Chunk size (default 800 chars), top-K (default 3), max context (default 1500 chars) are all env-driven. Tune for recall, latency, or context-window cost without touching code.",
    },
    {
      name: 'Designed to graduate into the SaaS',
      description:
        "The pipeline was built knowing it would slot into Agares SaaS as a managed multi-tenant service. The data model and service boundaries already mirror the SaaS's `KnowledgeBase → Document → DocumentChunk` schema - integration is a wiring exercise, not a rewrite.",
    },
    {
      name: 'Debug endpoints baked in',
      description:
        "`/ask-test` for raw stream inspection in the browser, `/api/debug/*` for smoke-testing Ollama health, model availability, and embedding round-trips. Saves hours when something upstream changes.",
    },
  ],

  techStack: [
    { name: 'Laravel 13 + PHP 8.3', reason: "RAG in PHP instead of Python - consistent with the rest of the Agares stack, and the pgvector binding is exactly as clean." },
    { name: 'PostgreSQL 17 + pgvector', reason: "Vector storage and similarity search inside the same database as the document rows. No separate vector DB to operate." },
    { name: 'Ollama\n(llama3.2 + embeddinggemma)', reason: "Local LLM stack. Chat model llama3.2 for generation, embeddinggemma for 768-dim embeddings - both swappable via env." },
    { name: 'smalot/pdfparser', reason: "Pure-PHP PDF text extraction. Keeps ingestion inside the Laravel container - no sidecar process." },
    { name: 'Docker (Postgres + pgvector)', reason: "Reproducible local stack. Ollama runs on the host for GPU access; Postgres + pgvector stay containerised." },
    { name: 'NDJSON over\n`Symfony StreamedResponse`', reason: "Laravel-native streaming with newline-delimited JSON events. Browser fetch + `ReadableStream` consumes it without WebSockets." },
    { name: 'SQLite in-memory\n(unit tests)', reason: "Pure-Eloquent paths get tested fast against in-memory SQLite; pgvector-dependent code paths run against the real Docker stack in integration tests." },
  ],

  screenshots: [],

  finish: {
    title: 'Running locally - heading for production',
    subtitle: 'Not yet hosted as a public service',
    text:
      "That's the tour. RAG Chatbot is fully functional today on a local stack but isn't a public service yet - it runs against your own Ollama install behind Docker.\n\n" +
      "It's queued for integration into Agares SaaS, where it'll become a managed multi-tenant RAG service callable via scoped `agr_` API keys. The SaaS-side schema (knowledge bases, documents, document chunks with `vector(1536)` embeddings) is already in place and waiting for the pipeline to land.",
  },

  links: {
    demo: null,
    repo: null,
  },
};

export default RAGChatbotSetup;
