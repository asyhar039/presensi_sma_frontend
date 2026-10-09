# Repository Guidelines

## Project Structure & Module Organization

- `src/main.tsx`, `src/app.tsx`: entrypoint and app shell.
- `src/routes/`: TanStack Router routes (`__root.tsx`, `index.tsx`, `dashboard.tsx`, `_auth/`, `dashboard/`). `routeTree.gen.ts` is generated — do not edit.
- `src/features/auth/`: domain feature code; follow this pattern for new domains.
- `src/components/ui/`: shadcn (`base-vega`, `zinc`, Tabler icons); `composite/`, `form/`, `layout/` for shared wrappers.
- `src/services/api-client.ts`, `src/lib/`, `src/stores/`, `src/hooks/`, `src/types/`, `src/constants/`, `src/utils/`: shared logic.
- Path alias: `@/*` maps to `./src/*` (see `tsconfig.json`).
- Assets: `src/assets/`, `public/`, `index.html`; styles in `src/styles/`.

## Build, Test, and Development Commands

- `bun install`: install deps (Bun; `bun.lock` committed).
- `bun run dev`: local Vite dev server.
- `bun run build`: `tsc -b` + production Vite build.
- `bun run preview`: preview production build.
- `bun run types`: typecheck only (`tsc -b`).
- `bun run lint` / `bun run format` / `bun run check`: Biome lint, format-write, full check.
- `bun run check:write`: auto-fix safe issues; `bun run fix` for unsafe fixes.
- Hooks via Lefthook: pre-commit runs Biome on staged files; pre-push runs `tsc -b`.

## Coding Style & Naming Conventions

- Indent 2 spaces, LF, UTF-8, trim trailing whitespace, final newline (`.editorconfig`, max length 100).
- Biome formatter: single quotes, JSX double quotes, `semicolons: asNeeded`, `trailingCommas: all`, organized imports (`:PACKAGE:` then `@/layouts|routes` then `@/**`).
- TypeScript strict: `noUnusedLocals/Parameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`.
- Naming: `kebab-case.tsx` for components (e.g. `dashboard-header.tsx`), `camelCase` for hooks/utils, `*-store.ts(x)` for Zustand stores, `*.types.ts` for types.
- Styling: Tailwind v4 + `clsx` + `tailwind-merge` via `@/lib/class-name`; validate forms with Valibot + TanStack Form.

## Testing Guidelines

- No test runner or `*.test.*` / `*.spec.*` files currently.
- Verify changes with `bun run types` and `bun run check`; manually exercise affected routes.
- If adding tests, colocate as `*.test.tsx` next to source and document the command here.

## Commit & Pull Request Guidelines

- History uses Conventional Commits: `feat(scope):`, `fix(scope):`, e.g. `feat(auth): enhance authentication flow`, `fix(api): align endpoint paths`.
- Keep commits focused; scopes seen: `auth`, `api`, `ui`, `layout,routes`, `students,teachers`.
- PRs: clear description, linked issue, affected routes/screenshots for UI, passing `tsc -b` + Biome checks.

## Security & Configuration Tips

- Copy `.env.example` to `.env`; required: `VITE_API_BASE_URL=http://localhost:8080/`.
- Never commit `.env`; API calls go through `src/services/api-client.ts` (axios); auth state in Zustand + `js-cookie`.
