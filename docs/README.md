---
title: Docs Index
description: How and when to add docs to this repo, and a one-line index of every doc in it.
---

# Docs

Start here. Read the index below, then open only the files you need. Architecture, commands and deploys are in [tech.md](../tech.md).

## Adding a File

**When**
- You built or changed a feature: add or update a file in `docs/features/`.
- You changed what a file in `Frontend/docs/` or `Backend/docs/` describes: update it. Add a new one there only for a new cross-cutting area of that app.

**How**
1. One concern per file. Name new files in short kebab-case, such as `code-panel-preview.md`.
2. Start with front matter, then the `# Title`:
   ```markdown
   ---
   title: Code Panel – Preview and Run Modes
   description: One line saying what's in the file and when to read it.
   ---
   ```
   Keep each value on one line, without `": "` or `" #"`, so it parses both as YAML and by splitting at the first colon.
3. When the file describes code, say what it was checked against: the commit or branch, and the date.
4. Link to related files instead of repeating them.
5. Add a line to the index below, under the file's folder, with the same description as its front matter. Keep each section sorted by file name. When a file's description changes, change it here too.

## Index

### Features (`docs/features/`)
How features work, across the frontend and the backend.
- [docs/features/code-panel-preview.md](features/code-panel-preview.md) — How the code panel finds the lesson and its auto-run or manual mode, picks the preview, builds the HTML preview and decides when to redraw.
- [docs/features/code-panel-python-java.md](features/code-panel-python-java.md) — How Python (MicroPython in the browser) and Java (Judge0 through n8n) lessons run against the lesson's tests, and how results reach the checks.
- [docs/features/code-panel-student-files.md](features/code-panel-student-files.md) — Where the editor's code comes from (guest browser cache or a signed-in student's saved copy), carry-over, and why lesson edits don't reach returning students.
- [docs/features/delete-student.md](features/delete-student.md) — How deleting a student works (who may delete, the one-transaction steps, what gets removed) and its known gaps.

### Frontend Reference (`Frontend/docs/`)
Written in Aug 2025 for the older copy of this frontend. The layout still matches, but check the current code before relying on details.
- [Frontend/docs/api.md](../Frontend/docs/api.md) — Frontend data fetching with RTK Query services in src/redux/services, the Axios client, and the Next.js API proxy routes.
- [Frontend/docs/auth.md](../Frontend/docs/auth.md) — Frontend sign-in and roles, with the JWT context, auth and role guards, auth forms and session handling.
- [Frontend/docs/checkers.md](../Frontend/docs/checkers.md) — Lesson checks that validate student code (regex checks and iframe signals), where their code lives and how they run.
- [Frontend/docs/components.md](../Frontend/docs/components.md) — Where UI code lives (src/components, src/sections, src/layouts) and the main reusable components.
- [Frontend/docs/config.md](../Frontend/docs/config.md) — Tenant JSON configs in public/configs, how tenant config is fetched, the Next.js config and environment detection.
- [Frontend/docs/error-handling.md](../Frontend/docs/error-handling.md) — Error pages (403, 404, 500), RTK Query error handling, form validation errors and notifications.
- [Frontend/docs/forms.md](../Frontend/docs/forms.md) — React Hook Form with Yup, the RHF wrapper components in src/components/hook-form, and where the schemas are.
- [Frontend/docs/helpers.md](../Frontend/docs/helpers.md) — Utility functions in src/utils (time, numbers, strings, localStorage) and the custom hooks in src/hooks.
- [Frontend/docs/routing.md](../Frontend/docs/routing.md) — Next.js pages-directory routes, dynamic routes, API routes and protected routes.
- [Frontend/docs/state.md](../Frontend/docs/state.md) — The Redux Toolkit store, its slices, the RTK Query services and the React context providers.
- [Frontend/docs/styling.md](../Frontend/docs/styling.md) — The MUI theme (palette, typography, shadows), component overrides, global styles and settings.

### Backend Reference (`Backend/docs/`)
Came over with the backend's code. `oldDocs/` holds the oldest guides. Check the current code before relying on details.
- [Backend/docs/caching-implementation.md](../Backend/docs/caching-implementation.md) — The in-memory cache for the tenant info endpoint (getTenantInfo), with its keys, invalidation and statistics, and how to add caching to other endpoints.
- [Backend/docs/databaseSchema.md](../Backend/docs/databaseSchema.md) — How the main entities relate (organizations, users, schools, students, courses, lessons), their key fields, the join tables and common patterns.
- [Backend/docs/directoryStructure.md](../Backend/docs/directoryStructure.md) — What lives where in Backend/src (API endpoints, core modules, manager services, config, providers, utils), plus the layers and file patterns.
- [Backend/docs/helperFunctions.md](../Backend/docs/helperFunctions.md) — The base entity and service classes, the utility functions (passwords, slugs, file schema) and the shared DTOs such as pagination.
- [Backend/docs/oldDocs/get-started.md](../Backend/docs/oldDocs/get-started.md) — Old setup guide from when the backend was called CT-Middleware (install, database, environment, dev mode, cloning the staging database). Check tech.md first.
- [Backend/docs/oldDocs/heroku-deployment.md](../Backend/docs/oldDocs/heroku-deployment.md) — Old manual Heroku deploy steps (login, git remote, migrations, pushing a version). The backend no longer deploys to Heroku.
- [Backend/docs/oldDocs/migration.md](../Backend/docs/oldDocs/migration.md) — Old guide to creating, applying and rolling back TypeORM migrations. Check the scripts in Backend/package.json before running anything.
