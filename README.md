# grounded-brain-ui

**Live site:** <https://grounded-brain.imohdsaif.in/dashboard>

Web client for **Grounded Brain**: upload sources (PDFs, websites, YouTube, GitHub repos, notes), chat with them with citations, and generate study material (summaries, flashcards, quizzes, mind maps, repo wikis).

Built with Next.js 16 (App Router), React 19, TanStack Query, the Vercel AI SDK, Tailwind CSS 4 and Base UI. It talks to the [grounded-brain API](../grounded-brain-notebook-llm), which owns auth, ingestion, retrieval and generation.

## Getting started

```bash
cp .env.example .env.local   # point API_URL at a running API
npm ci
npm run dev                  # http://localhost:3000
```

Requires Node 20.9+. The API must be running and configured with this app's URL as a trusted origin for Google sign-in.

| Variable         | Required          | Description                                                    |
| ---------------- | ----------------- | -------------------------------------------------------------- |
| `API_URL`        | In production     | Base URL of the API. Defaults to `http://localhost:8080` in dev |
| `API_TIMEOUT_MS` | No                | Timeout for server-side API calls (default `10000`)            |

`next build` fails fast without `API_URL`: rewrites are resolved at build time, so a missing value would ship a broken app.

## Scripts

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev server                                   |
| `npm run build`     | Production build (`standalone` output)       |
| `npm start`         | Serve the production build                   |
| `npm run lint`      | ESLint over the whole repo                   |
| `npm run typecheck` | Generate route types, then `tsc --noEmit`    |
| `npm test`          | Vitest unit tests (`npm run test:watch` to watch) |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and a production build on every PR.

## Architecture

### Request flow

```
Browser ──/api/*──▶ Next.js rewrite ──▶ API          (client data: TanStack Query)
Server Component ──backendFetch──────▶ API          (session, workspace for layouts)
```

- **Browser → API** goes through a same-origin `/api/:path*` rewrite, so cookies just work and there is no CORS. Chat streams use the same path.
- **Server → API** calls `API_URL` directly (`shared/server/backend.ts`), forwarding the user's cookies. Results are wrapped in React `cache()` so a layout and its page share one request.
- Every response is validated with **zod** at the boundary (`features/*/lib/schemas.ts`). Types are inferred from those schemas, so contract drift fails loudly instead of surfacing as `undefined` in a component.

### Auth

There are three layers, and each does only what it can do cheaply:

1. **`proxy.ts`**: an optimistic check that a session cookie exists. It never calls the API.
2. **`app/(protected)/layout.tsx`**: verifies the session with the API (`requireSession`).
3. **The API**: authorizes every request. The UI never relies on 1 or 2 for security.

Post-login redirects are restricted to same-origin paths (`safeRedirectPath`).

### Project structure

```
app/                     Routes only: thin pages, layouts, error/loading boundaries
  (auth)/                Login
  (protected)/           Auth-gated routes
    workspace/[id]/      Layout renders the workspace shell once for all tabs
features/<name>/         One folder per domain: auth, workspaces, sources, chat, learn, memory
  components/            UI for the feature
  hooks/                 TanStack Query hooks (query keys + mutations)
  lib/                   api.ts (calls), schemas.ts (zod), types.ts (inferred), pure logic
  index.ts               Client-safe public API
  server.ts              Server-only loaders (`import "server-only"`)
shared/
  config/                env, routes, model registry
  server/                backendFetch
  lib/                   API client, errors
  hooks/                 Cross-feature hooks (useInvalidatingMutation, ...)
  components/            Providers, status/error screens, markdown renderer
components/ui/           Generated shadcn/Base UI primitives (keep unmodified where possible)
```

### Conventions

- **Routes** come from `shared/config/routes.ts`. Features never import each other's internals.
- **Mutations** use `useInvalidatingMutation`. Failures surface as a global toast unless the component shows the error inline (`{ suppressErrorToast: true }`).
- **Server-only code** lives in `features/*/server.ts` or `shared/server/` and imports `server-only`.
- **Chat models** in `shared/config/models.ts` must match `CHAT_MODELS` in the API.
- LLM-generated artifact content is validated per type (`features/learn/lib/content.ts`) before it is rendered.

## Deployment

```bash
docker build --build-arg API_URL=https://api.example.com -t grounded-brain-ui .
docker run -p 3000:3000 -e API_URL=https://api.example.com grounded-brain-ui
```

The image uses Next's `standalone` output and runs as a non-root user. Responses carry a CSP, HSTS (production), `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` (see `next.config.ts`). The rewrite proxy allows 120s of upstream silence for long chat responses and 12MB request bodies for PDF uploads.
