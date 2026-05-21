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
- `src/providers/` - External integrations (S3, Google Auth, OpenAI, Unsplash)
- `src/middlewares/` - Tenant resolution via `OrgMiddleware` (reads `x-tenant-id` header)

**Multi-Tenancy**: Organization-based. `OrgMiddleware` injects `org_id`, `org_slug`, `school_id` into request using `RequestWithMeta` interface.

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

---

## Critical Patterns

**Backend**:
- Use DTOs with class-validator for validation
- Manager services injected via NestJS DI
- Pattern: API → Manager → Core Service → Entity

**Frontend**:
- All API calls through RTK Query services
- Build process copies TinyMCE to public
