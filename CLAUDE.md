# Rules

High Effort mode! make searches detailed, make plans detailed but report me briefly.
Communicate briefly
Don't write code in responses
Don't create md files or documentation
Dont barrel export for less than 5 elements
Dont comment in code
Dont install packages, you cant install packages
After feature edit, update a relevant line in tech-be or tech-fe
dont kill server/chrome , i may be working on other projects simuntaneusly.
Use code blocks for tables (no box drawing characters ─┼├┤┬┴┌┐└┘│)

if task is complicated, ask agents to handle, give it a detailed context (dont over steer, point files, logic etc)
we have "manager", "worker" and "checker" agents.

For frontend tasks read tech-fe.md , for backend tech-be.md.
For big changes in system prepend to changes.md

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
- `src/providers/` - External integrations (S3, Google Auth, OpenAI)
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

---

## Critical Patterns

**Backend**:
- Use DTOs with class-validator for validation
- Manager services injected via NestJS DI
- Pattern: API → Manager → Core Service → Entity

**Frontend**:
- All API calls through RTK Query services
- Build process copies TinyMCE to public
