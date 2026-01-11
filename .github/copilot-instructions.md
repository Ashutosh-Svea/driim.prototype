## Quick orientation for AI coding agents

This repo is a small Expo (React Native) app with a minimal Node/Express backend. Use these focused notes to get productive quickly.

- **Big picture:** The mobile/web app lives in the `client/` folder (Expo + React Native). A thin server that serves static Expo builds and provides an API scaffold lives in `server/`. Local app data is currently stored client-side using `AsyncStorage`; the `server/` code is prepared for future API routes and static hosting.

- **Start / build commands:** See `package.json` scripts.
  - Dev (Expo + local packager): `npm run expo:dev`
  - Server dev: `npm run server:dev` (runs `tsx server/index.ts`)
  - Build static web: `npm run expo:static:build` then serve via `server_dist` with `npm run server:build` and `npm run server:prod`
  - DB migrations: `npm run db:push` (drizzle-kit)

- **Key integration points / files**
  - App entry: [client/App.tsx](client/App.tsx)
  - Navigation: [client/navigation/RootStackNavigator.tsx](client/navigation/RootStackNavigator.tsx)
  - Global state / persistence (client): [client/contexts/DreamContext.tsx](client/contexts/DreamContext.tsx) — uses `@react-native-async-storage/async-storage` and exposes `useDreams()` patterns.
  - AI helper (client-side, not an LLM): [client/services/aiService.ts](client/services/aiService.ts) — heuristic reflection generator used by UI components.
  - Server bootstrap & static routing: [server/index.ts](server/index.ts) — serves `static-build`, dynamic manifest routing for Expo web, and configures CORS/body parsing.
  - Server routes placeholder: [server/routes.ts](server/routes.ts) — `registerRoutes` returns an HTTP server; real API routes are currently not defined here.
  - DB schema + migrations: [shared/schema.ts](shared/schema.ts) and [drizzle.config.ts](drizzle.config.ts)

- **Data flow notes**
  - Dreams are persisted client-side in `AsyncStorage` under key `@driim_dreams` via `DreamContext` (see `loadDreams`, `saveDreams`, `addDream`, `updateDream`). If you need to add a server-backed API, mirror the `DreamInput`/`Dream` shape from `client/types/dream.ts` and implement routes in `server/routes.ts`.
  - The server currently acts mainly as a static file/manifest host for Expo web builds and a scaffold for future APIs. When adding server endpoints, update CORS handling in `server/index.ts` to allow EXPO/web origins.

- **Project-specific conventions**
  - Path alias `@/` is used in imports (see `client/` files). Respect these aliases when editing imports or add editor/tsconfig support if you need to run static checks.
  - Local AI logic lives in `client/services/aiService.ts` (synchronous pseudo-AI with deterministic heuristics). There is no outbound LLM call in the current codebase.
  - UI state is centralized in `DreamContext` (provider + hook `useDreams()`); prefer using that hook rather than prop-drilling.
  - The server uses `tsx` for dev run and `esbuild` for production bundle (`server_dist`). See `package.json` scripts.

- **Patterns & examples to follow**
  - Error handling: components wrap the app in `ErrorBoundary` ([client/components/ErrorBoundary.tsx](client/components/ErrorBoundary.tsx)). Follow the pattern when adding risky UI blocks.
  - Query / caching: `@tanstack/react-query` is used (`client/lib/query-client.ts`). Use `useQuery`/`useMutation` patterns consistent with existing client code.
  - Types: prefer TypeScript Zod or explicit interfaces already present (see `shared/schema.ts` and `client/types/dream.ts`). Keep server/client DTOs aligned when adding API endpoints.

- **When you need to add features**
  - Adding API routes: implement handlers under `server/` and register them inside `registerRoutes` in [server/routes.ts](server/routes.ts). Run `npm run server:dev` to test locally.
  - If persisting server-side, run `npm run db:push` after updating `shared/schema.ts` and confirm `drizzle.config.ts` DB URL env is set.
  - Building web for testing: run `npm run expo:static:build` then `npm run server:build` and `npm run server:prod` to serve the static output.

If anything here is unclear or you want more detail (examples of a server-backed Dream API or how to wire an LLM), tell me which area to expand and I will update this file.
