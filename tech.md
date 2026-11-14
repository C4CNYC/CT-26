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
- **Frontend** (`/Frontend`) - Next.js 14 + TypeScript + Redux Toolkit 2 + Mui 5, built on Node 22 (`netlify.toml`)

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
- `src/providers/` - External integrations (S3, Google Auth, OpenAI, Unsplash proxy at `/unsplash/image`). Netlify edge-proxies `codetribe.ai/unsplash/WxH/:query` -> backend `/unsplash/image` (square `WxH` dims; non-square needs a backend path route, pending backend deploy)
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
- `_app.tsx` `stableTenant` precedence (2026-07-12, updated): `_app.getInitialProps` REMOVED to restore Automatic Static Optimization. `stableTenant = useTenants() ?? DEFAULT_TENANT` — favicon/meta/Redux `state.tenant` now hydrate client-side from `localStorage.tenant` (returning visitors, no flash) or the tenant API (first visit, ~1 paint of default). Removed `getTenantByDomain`/`serverTenant`/`App.getInitialProps` plumbing; `serverUtils.ts` tenant SSR cache now unused (dead, tree-shaken) but kept. Build went from 0 static / 95 dynamic → 91 static / 4 dynamic (only `api/*` + `gallery-public/[id]` stay ƒ). The 'opted-out of Automatic Static Optimization' warning is gone; static HTML is CDN-cacheable → TTFB ~750 ms → ~50 ms post-deploy

---

## Critical Patterns

**Backend**:
- Use DTOs with class-validator for validation
- Manager services injected via NestJS DI
- Pattern: API → Manager → Core Service → Entity
- `TeacherSchoolSetupService` (school-manager module): shared service for teacher school creation — checks pending school invites before creating new school; otherwise creates a school and one class (cover `#75CF6D`), adds the teacher and enrolls their student profile in that class. It copies no lesson: new teachers start their class on an existing course (Nov 13). Used by both `auth-manager` and `auth-google-manager` (email sign-up, Google sign-up, and first Google sign-in). Fixed 2026-11-13: it read `school.classes[0]` from a school loaded without classes, so every teacher sign-up returned 500 after the account was created.
- Welcome emails: each sign-up (email, Google sign-up, first Google sign-in) emits one event, `CREATE_ORG(email, req.org_name)` for a teacher or `CREATE_STUDENT(email)` for a student; `EmailsManagerService` picks the sender with `getTenantConfig(org_name)`. Fixed 2026-11-13: the Google routes emitted `CREATE_ORG` twice (with the tenant id, then with a `{ email, user_id }` object), so Google teachers got two emails and Google students none.
- `POST /manager/school/:school_id/student/:id/promote` — promotes student to teacher (changes role + adds to school teachers)
- Build fix 2026-07-14 (`src/api/utils/markdown-body.decorator.ts`): `raw-body`'s typings clash with Express `Request[Symbol.asyncIterator]` (TS2345, breaks `nest build`). Cast `req` to `NodeJS.ReadableStream` before `getRawBody(req)` — runtime unchanged.
- Slide progress (`LessonContent.progress`) is attached only by `CourseProgressService.attachStudentProgressToLessonContents`: the signed-in student's own `course-progress` row on the slides they completed, `[]` on the rest and when there is no student. It looks up from the student (`students.progressId` → `progress_lesson_complete`); never join `contents.progress` from the lesson side. Used by `GET /student/lesson/:id`, `GET /student/lesson/:id/content` and the student module view (`CourseUnitManagerService`). Student lesson routes use `OptionalJwtAuthGuard`: a route without a guard never gets `request.user`, because `@Roles` alone doesn't authenticate. Completing a slide (`completeLesson` → `POST /student/progress/complete-chalange`) sends only `lesson_content_id` and `code`, and guest progress in localStorage (`progress_<lessonId>`) keeps only `slideId`s: slide progress is per student, never per course or unit.
- Jokes (`src/api/public/jokes-public-api`): `GET /jokes/random` returns `{ type, setup, punchline, id }` for a random entry of `official-joke-api-jokes.json` (414 kid-friendly jokes, MIT, from 15Dkatz/official_joke_api, whose hosted API is down). The project's other 37 entries were left out on Nov 13: 33 not for kids (alcohol, drugs, swearing, violence, mocking disability or looks, ethnic or religious jokes, innuendo, insults) and 4 exact duplicates. It needs no tenant header (`jokes/(.*)` is excluded from `OrgMiddleware`). Lessons call it as `/api/jokes/random` on their own site, and `Frontend/src/pages/api/jokes/random.ts` forwards that to the backend.
- One-time data fix, to be removed once it has run in production: `StudentLessonFileJokesApiAddressFix` (`src/modules/core/student-lesson-file`) runs on boot, in the background. In `student-lesson-files`, it rewrites the retired `https?://official-joke-api.appspot.com/jokes/random` to `/api/jokes/random`, then turns a double-quoted path with spaces or line breaks inside the quotes into `"/api/jokes/random"`, so students' saved code matches the lessons. It leaves `updatedAt` as it is, logs how many files it changed, and is idempotent.

**Frontend**:
- All API calls through RTK Query services
- Build process copies TinyMCE to public
- React 19-ready libraries (2026-11-09, prep for Next 16): split panes use `ResizableSideBySidePanes` (`@uiw/react-split`), the mobile code-panel swipe is a CSS transform, `html-react-parser` replaces `react-html-parser`, and `@lottiefiles/dotlottie-react` plays the checker animations (`components/checkers-completed-animation`)
- React 19 prep, part 2 (2026-11-13): no `@mui/styles` (it only supports React 17). The code-panel timer and collab editor style with `sx` (their `styles.ts` files), and the footer tooltip colors come from `GlobalStyles` on a class (`footer/menu/constants.ts`). The checkers code editor closes its menu with MUI's `ClickAwayListener`. The MicroPython `import()` in `python.worker.ts` carries `turbopackIgnore` next to `webpackIgnore`, so both bundlers leave it alone
- `LocalizationProvider`/`AdapterDateFns` are NOT global; wrapped per-component via `src/components/DateLocalizationProvider.tsx` (used only by date-picker files: `TimeController`, `AssignmentsTableToolbar`, `AssignmentDrawer`) so `@mui/x-date-pickers` stays out of the `_app` chunk
- `@mui/x-date-pickers` 7 takes only `Date | null`; forms that store date strings convert at the picker (`value ? new Date(value) : null`). Intro tours use react-joyride 3 (`onEvent`, shared props in `sections/intro-tours/tour-joyride-shared-props.ts`; its `flipOptions` (`fallbackPlacements: undefined`, `fallbackAxisSideDirection: 'end'`) make a left/right step that doesn't fit try the opposite side first, as Joyride 2 did, then bottom and top; Joyride 3 alone only tries bottom and top. `shiftOptions.crossAxis` keeps a tooltip whose target fills the screen inside the viewport, as Joyride 2 did)
- Class `cover` can be an empty string: the class created at teacher sign-up has `cover: ''`. `getLinearGradient` and its callers fall back with `||`, not `??`, because MUI's `alpha('')` throws and crashes the class page
- RTK Query hooks that need a user id must use `skip: !id` to avoid firing with `undefined` in the URL (see `useContinueUnit`)
- Code panel preview: the lesson's `autoRun` property is read for `state.codePanelGlobal.lessonId` (`CodePanelContextProvider`). `ViewBlock` counts Run/Refresh clicks in `runCount` and picks the preview from the lesson's files. HTML lessons get `BrowserViewHTML` with `iframeKey = runCount + reloadIframeKey`; with `autoRun` off it draws once when the lesson's files load or change to a different set (by file `id` + `lessonContentId`: another lesson or slide, or a file added or removed) and on each Run/Refresh, never while typing. The preview stays mounted across "next lesson", so "on open" can't be a mount-time draw. Lessons with `.py` or `.java` files get `BrowserViewEx` with `runCount` alone, so Python (MicroPython in the browser) and Java (Judge0 via the n8n `CodeRunner` webhook) run on open and on each Run/Refresh, never while typing, and their Run button shows even when `autoRun` is on. A link without `courseId` (e.g. `?lessonId=` only) gets `courseId` and `unitId` added from the lesson's `coursePlacement` (`GET /student/lesson/without-contents/:id`, `CourseService.findLessonCoursePlacement`: an active course, the one the signed-in student's class has first, else the oldest), keeping its other params (e.g. `ai=true`). Only a lesson in no course stays lesson-only, and `code-panel/index.tsx` then sets `lessonId` from the lesson.

**Perf hotspots (course page load ~20s)**:
- `_app` chunk was ~517 KB gzip / 1.7 MB raw on every page. Fixed 2026-07-12: the `@/components` + `@/components/hook-form` barrels statically re-exported `RHFCode` (→ `@uiw/react-codemirror` + full `@codemirror/*`/`@lezer/*` stack, ~115 KB gz) and the dead `slider/SliderDemoMui` (→ `react-slick`, ~17 KB gz), so every route dragged a code editor it never renders. Removed `RHFCode`/`SliderDemoMui` from the barrels and switched their consumers to deep imports (`@/components/hook-form/RHFCode`). Result: `_app` 517→383 KB gz (−131 KB gz, −26%); `/student/courses` First Load JS 684→565 KB. CodeMirror now loads only on the manager/editor pages that use it (no regression there). Remaining in `_app`: `@mui/material` 107 KB gz, `date-fns` 20 KB gz (used app-wide), `react-style-proptype` 5 KB gz. Note: `yarn build` needs `./node_modules/.bin/next build` (yarn 4 doesn't put `.bin` on PATH). Fixed 2026-07-12 (barrel trim): removed 5 heavy `export *` lines from `@/components/index.ts` (`hook-form`, `upload`, `upload-image-modal`, `custom-input`, `date-range-picker`) so react-hook-form + react-dropzone + @mui/x-date-pickers no longer ship in `_app`; ~106 consumers across `sections/`+`pages/`+`components/` switched to deep imports (`@/components/hook-form`, `@/components/upload`, `@/components/upload-image-modal`, `@/components/custom-input`) — verified by `tsc` (0 errors) + `next build`. Result: `_app` 383→334 KB gz (−49 KB gz); `/student/courses` First Load JS 565→555 KB; 0 occurrences of dropzone/RHF/x-date-pickers in `_app`. The other 21 removed-by-mistake light barrels (settings/iconify/image/animate/table/slider/autocompletes etc.) were restored — only the 5 genuinely heavy ones stay out. Also deferred GTM (`components/google-analytics`): loads via `requestIdleCallback` (timeout 5 s) instead of `next/script lazyOnload`, pushing ~285 KB / ~1.06 s main-thread out of the Lighthouse window
- RESOLVED 2026-07-12 (static optimization): `_app.getInitialProps` was removed (see `stableTenant` note above), so pages are now static (`○`) and Netlify serves prebuilt HTML from the CDN — no per-request function invocation, no tenant SSR call. Measured live TTFB was 757 ms (cold Netlify function + tenant API); expected ~50 ms post-deploy. Previously mitigated via a module-level SSR cache in `serverUtils.ts` (TTL 5 min / negative 30 s, in-flight dedup) — now dead code since `_app` no longer SSRs the tenant.
- Verified live 2026-07-12 post-deploy: nav TTFB 757→313 ms (cold edge hit), warm edge ~110 ms; `age` header confirms HTML is now CDN-cached (was `no-store`); FCP 1960→~840 ms. `_app` FLJS unchanged (554 KB) — static caching is the win, not bundle size.
- Caching headers 2026-07-12 (`netlify.toml`): added `Cache-Control: public,max-age=86400,stale-while-revalidate=604800` for `/assets/lang/*` (kills the per-load 19 KB refetch of each locale JSON by `i18next-http-backend`; now `cached` on repeat) and `immutable` for `/assets/icons/*`. HTML doc stays `max-age=0,must-revalidate` (Netlify Next plugin owns it; correct for tenant/auth freshness, edge-cached via `age`). `_next/static/*` + `/fonts/*` already immutable.
- Entry redirect 2026-07-12 (`pages/index.tsx`): replaced `router.push(X)` with `window.location.href=X` (hard nav) for the auth/org entry redirects (logged-in→courses, catalog→courses, etc.). Reason: a soft `router.push` fetched the target's `_next/data` (~500 ms) during the redirect; hard nav loads the edge-cached static HTML instead. Routing decision logic (guards `isLoading/tenant/isInitialized/user` + `home_page_type` switch) unchanged — only the nav method changed; auth/tenant survive in localStorage. Back-button behavior preserved (`href` adds a history entry like `push`). All 3 path constants verified to be strings (not UrlObjects) so `window.location.href` is safe.
- `_next/data/HASH/en/<path>.json` (2026-07-12 finding): Next's i18n client router fetches the current route's `_next/data` AFTER hydration on EVERY page load (even hard nav, clean URL, no SW, no app-code `router.push`). Because ASO-static pages have no `getStaticProps`, Next emits NO prebuilt data JSON (only `.html`, confirmed in `.next/server/pages/`), so Netlify serves the prerendered HTML at the `.json` URL (`content-type: text/html`, ~500 ms, ~2 KB). It is NON-BLOCKING (fires ~711 ms post-load, finishes ~1211 ms; FCP ~2660 ms unaffected) and cached on repeat (304). To make it FAST (not eliminate): add `export const getStaticProps = () => ({ props: {} })` to a page → Next prebuilds the static JSON → CDN ~50 ms. Low ROI (non-blocking), so deferred; revisit only if it shows up as a Lighthouse bottleneck. App-level soft navs still fetch `_next/data` on click (inherent to Pages Router — `prefetch={false}` only stops background prefetch, not click nav).
- Netlify edge TTFB ~450 ms to TR (consider Cloudflare in front). Next step for full HTML caching would need per-tenant `Cache-Control` + Netlify edge/DPR cache keyed by host
- Fixed 2026-07-12 (prefetch): Next.js auto-prefetched every in-viewport nav/breadcrumb `<Link component={NextLink}>` (default), firing each target's `_next/data` JSON through `_app.getInitialProps` → cold Netlify function + tenant SSR call (~7 s each for `gallery.json`/`manager/courses-main.json`) during the courses page's critical load. Set `prefetch={false}` on the default Link in all 3 NavItem variants (`nav-section/{vertical,horizontal,mini}/NavItem.tsx`) + `custom-breadcrumbs/LinkItem.tsx`. Click-navigation is unaffected (route fetches on click); only the background viewport prefetch is removed. NOTE: prefetch only happens in production builds, so this can't be verified in `yarn dev` — confirm post-deploy via the Network tab (no `_next/data/*.json` for nav targets on load). Verified safe via Next 14.2 `link.js`: `prefetchEnabled = prefetchProp !== false`
- Fixed 2026-07-12 (guarded hooks firing): `OrgSwitcher` was firing `useGetOrgListQuery` unconditionally (only render was gated by `RoleBasedGuard`), so every non-superadmin page logged `GET /super-admin/org 401`. Now `skip`ed unless `user?.role === SuperAdmin`. Same bug/fix in `SchoolSwitcher` (`useGetMySchoolsQuery` → `GET /manager/school 401`), now `skip`ed unless role in `[SuperAdmin,Admin,Manager,Owner]`. Pattern to remember: a hook placed above/outside `RoleBasedGuard` still fires its request even when the guard hides the UI. Also `useContinueCourse` auto-fired `useGetLastLessonByCourseQuery` per course card with empty `studentId` fallback (`profile?.id || ''`) → `GET /student/progress/course/{id}/ 404` (route needs 2 params) plus N wasted calls for N cards. Hook now takes `progress` and `skip`s when `!studentId || !progress`; `refetch()` on click still force-fetches when skipped. Audit 2026-07-12 of all global-render query hooks (layouts/header/nav/menu-items): the 3 above were the only true role-leaks. `SchoolAccount.tsx` is parent-gated by `isSchoolSection` (Header renders it only for SuperAdmin/Admin/Owner) — safe. `MenuTribesList`/`members-card`/`student/class/[id]` skip by role. `SchoolDashboardLayout`/`manager/apps` are manager-only pages (query intended). `sandbox-dialog` skips until open and `getLessonsByIds` is a `queryFn` that no-ops on `[]` (no request). Defensive-only: `LestCodeBtn` `useGetLastWorkspaceQuery` aligned to `skip: !profile` like its 3 siblings (endpoint permits all roles, was not erroring)
