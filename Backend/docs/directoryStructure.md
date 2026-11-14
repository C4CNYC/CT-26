---
title: Backend Directory Structure
description: What lives where in Backend/src (API endpoints, core modules, manager services, config, providers, utils), plus the layers and file patterns.
---

# Directory Structure

### Application Core  (`src/`)
```
src/
├── app.module.ts           # Main module
├── main.ts                 # Entry point
└── orm.datasource.ts       # Database config
```

### API Endpoints (`src/api/`)

```
admin/
├── course-api/
├── lesson-api/
├── school-api/
└── user-api/

manager/
├── course-manager-api/
├── lesson-manager-api/
├── school-manager-api/
└── student-manager-api/

student/
├── student-courses-api/
├── student-lessons-api/
├── student-progress-api/
└── student-assignments-api/

public/
├── tenant-public-api/
└── webhooks/
```

### Core Modules (`src/modules/core/`)

```
core/
├── user/
├── student/
├── organization/
├── school/
├── class/
├── course/
├── lesson/
├── lesson-content/
├── assignment/
├── course-progress/
├── media/
└── invitation/
```

### Manager Services (`src/modules/managers/`)

```
managers/
├── auth-manager/
├── course-manager/
├── lesson-manager/
├── student-manager/
├── school-manager/
└── media-manager/
```

### Configuration (`src/config/`)

```
config/
├── app.config.ts
├── auth.config.ts
├── s3.config.ts
└── sendgrid.config.ts
```

### External Providers (`src/providers/`)

```
providers/
├── google-auth/
├── openai/
├── s3/
└── sendgrid/
```

### Utilities (`src/utils/`)

```
utils/
├── base/
│   ├── base.entity.ts     # Base database entity
│   └── base.service.ts    # Base CRUD service
├── dtos/
├── password.ts
├── generateSlug.ts
└── swagger.ts
```

## Architecture

### Layers
- **API**: HTTP controllers
- **Manager**: Business logic
- **Core**: Database entities/services
- **Provider**: External integrations

### File Patterns
- `*.entity.ts` - Database models
- `*.service.ts` - Business logic
- `*.controller.ts` - API endpoints
- `*.dto.ts` - Data validation