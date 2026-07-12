# CodeTribe Tech

For project rules and guidelines, see [CLAUDE.md](CLAUDE.md).

---

## Database Connection & SQL

Connection strings are in `.env`

Connect to ct26 PostgreSQL:
```bash
docker run -it --rm postgres:17 psql "$DATABASE_URL"
```

Run SQL file:
```bash
docker run -i --rm postgres:17 psql "$DATABASE_URL" < file.sql
```

Dump/Restore:
```bash
# Dump: docker run --rm postgres:17 pg_dump "$DATABASE_URL" > dump.sql
# Restore: docker run -i --rm postgres:17 psql "$DATABASE_URL" < dump.sql
```

---

# Project Overview

CodeTribe is an educational platform with multi-tenant architecture.

- **Backend** (`/Backend`) - NestJS API with PostgreSQL + TypeORM, requires Node.js 22.x
- **Frontend** (`/Frontend`) - Next.js 14 + TypeScript + Redux Toolkit + Mui

---

## Commands

### Backend
```bash
cd Backend
yarn start:dev     # Development server
yarn migration:run         # Run migrations
yarn migration:generate    # Generate from entity changes
```

### Frontend
```bash
cd Frontend
yarn dev          # Development server (port 8080)
```

---

## Backend Architecture

**Layer Structure**: Controllers → Manager Services → Core Services → Entities

**Key Patterns**:
- All entities extend `BaseEntity`, all core services extend `BaseService`
- `src/api/` - Controllers by access level (admin, manager, student, public, super-admin)
- `src/modules/core/` - Entities + core services
- `src/modules/managers/` - Business logic coordination
- `src/old-auth/` - JWT auth, guards, strategies
- `src/providers/` - External integrations (S3, Google Auth, OpenAI, Unsplash proxy at `/unsplash/image`)
- `src/middlewares/` - Tenant resolution via `OrgMiddleware` (reads `x-tenant-id` header)

**Multi-Tenancy**: Organization-based. `OrgMiddleware` injects `org_id`, `org_slug`, `school_id` into request using `RequestWithMeta` interface. Routes `unsplash/*`, `jokes/*`, `health`, `tenant/:slug` are excluded from org middleware.

**Auth/Authorization**: JWT tokens, role-based guards (Admin, Manager, Student, SuperAdmin).

**Database**: Migrations via TypeORM (use npm scripts, not direct CLI).

---

## Deployment

Server to be aware of where we deploy and their status

**Dokploy** servers managed via `~/.pi/agent/skills/dokploy/`:

| **ct252** | 104.236.67.252 | 3000 | CT26 project (Backend + PostgreSQL) |

### ct252 Projects
- **CT26** - Main project with:
  - Backend application (ct26-backend-1aoo85)
  - PostgreSQL database (ct26-db-jgw7kj)
  - Domain: ct26be.codetribe.ai

### Dokploy Skill Commands
```bash
cd ~/.pi/agent/skills/dokploy
source config/dokploy.env
./scripts/list-projects.sh [server]           # List projects
./scripts/get-deployment.sh <appId> [server]  # Get deployment history
./scripts/deploy.sh <appId> [server]         # Trigger deployment
./scripts/health-check.sh <appId> [server]    # Check application status
```

## Frontend Architecture

**State**: Redux Toolkit + `redux-persist`, RTK Query for API calls

**Services** (`src/redux/services/`):
- `admin/` - Admin APIs
- `manager/` - Manager APIs
- `tenant/` - Tenant config
- `auth.ts`, `student-auth.ts`

**Slices** (`src/redux/slices/`): UI state and feature slices

**Routing**: Next.js file-based routing in `src/pages/`

**Multi-Tenancy**: Configs from `src/redux/services/tenant-configs.ts`, dynamic theming

**Tenant Resolution** (`src/hooks/useTenants.ts`):
- Priority: `localStorage.tenant` (cached object) > `localStorage.tenantName` (set by OrgSwitcher) > hostname
- Module-level `isFetching` flag prevents duplicate API calls across 13+ component instances
- Stores fetched tenant in `localStorage.tenant` for subsequent component renders
- Super admin tenant switch works by setting `localStorage.tenantName` before reload
- `_app.tsx` `stableTenant` precedence (2026-07-12): client-resolved `useTenants()` tenant wins once hydrated, `serverTenant` (`getInitialProps` by host, SSR-safe first paint) as fallback, then `DEFAULT_TENANT` — so OrgSwitcher now drives favicon/meta/Redux `state.tenant`, not just data; server cache in `serverUtils.ts` untouched

---

## Critical Patterns

**Backend**:
- Use DTOs with class-validator for validation
- Manager services injected via NestJS DI
- Pattern: API → Manager → Core Service → Entity
- `TeacherSchoolSetupService` (school-manager module): shared service for teacher school creation — checks pending school invites before creating new school. Used by both `auth-manager` and `auth-google-manager`.
- `POST /manager/school/:school_id/student/:id/promote` — promotes student to teacher (changes role + adds to school teachers)

**Frontend**:
- All API calls through RTK Query services
- Build process copies TinyMCE to public
- `LocalizationProvider`/`AdapterDateFns` are NOT global; wrapped per-component via `src/components/DateLocalizationProvider.tsx` (used only by date-picker files: `DateRangePicker`, `TimeController`, `AssignmentsTableToolbar`, `AssignmentDrawer`) so `@mui/x-date-pickers` stays out of the `_app` chunk
- RTK Query hooks that need a user id must use `skip: !id` to avoid firing with `undefined` in the URL (see `useContinueUnit`)

**Perf hotspots (course page load ~20s)**:
- `_app` chunk was ~517 KB gzip / 1.7 MB raw on every page. Fixed 2026-07-12: the `@/components` + `@/components/hook-form` barrels statically re-exported `RHFCode` (→ `@uiw/react-codemirror` + full `@codemirror/*`/`@lezer/*` stack, ~115 KB gz) and the dead `slider/SliderDemoMui` (→ `react-slick`, ~17 KB gz), so every route dragged a code editor it never renders. Removed `RHFCode`/`SliderDemoMui` from the barrels and switched their consumers to deep imports (`@/components/hook-form/RHFCode`). Result: `_app` 517→383 KB gz (−131 KB gz, −26%); `/student/courses` First Load JS 684→565 KB. CodeMirror now loads only on the manager/editor pages that use it (no regression there). Remaining in `_app`: `@mui/material` 107 KB gz, `date-fns` 20 KB gz (used app-wide), `react-hook-form` 9 KB gz (other RHF fields still in barrel), `react-dropzone` 6 KB gz (via `@/components/upload` barrel, high blast-radius to cut), `react-style-proptype` 5 KB gz. Note: `yarn build` needs `./node_modules/.bin/next build` (yarn 4 doesn't put `.bin` on PATH)
- `_app.getInitialProps` forces SSR + a tenant API call per request, so Netlify can't cache HTML (`no-store`, edge miss). Mitigated: `getTenantByDomain` now has a module-level SSR cache (`serverUtils.ts`, TTL 5 min / negative 30 s, in-flight dedup) — warm TTFB ~28 ms vs ~230 ms local, tenant call 0 ms on hit. Per Netlify function instance; first request per cold instance still pays the ~750 ms API call.
- Netlify edge TTFB ~450 ms to TR (consider Cloudflare in front). Next step for full HTML caching would need per-tenant `Cache-Control` + Netlify edge/DPR cache keyed by host
