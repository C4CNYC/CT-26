# Database Helper Functions

This document outlines the key database helper functions and utilities used throughout the CT-Middleware application.

## Base Entity and Service Classes

### BaseEntity (`src/utils/base/base.entity.ts`)

Provides common fields for all database entities:

```typescript
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: string

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: string
}
```

**Features:**
- UUID primary key generation
- Automatic timestamp tracking for creation and updates
- Timezone-aware timestamps

### BaseService (`src/utils/base/base.service.ts`)

Generic service class providing CRUD operations for all entities:

#### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `create()` | Creates a new entity | `data: DeepPartial<T>`, `entity_manager?: EntityManager` | `Promise<T>` |
| `findOne()` | Finds a single entity | `filters: FindOneOptions<T>`, `entity_manager?: EntityManager` | `Promise<T>` |
| `find()` | Finds multiple entities | `filters`, `relations?`, `entity_manager?`, `order?` | `Promise<T[]>` |
| `update()` | Updates an entity | `id`, `data: DeepPartial<any>`, `entity_manager?` | `Promise<UpdateResult>` |
| `remove()` | Deletes an entity | `id: string`, `entity_manager?` | `Promise<DeleteResult>` |

**Key Features:**
- Transaction support via optional `EntityManager`
- Generic type safety
- Standardized CRUD interface

## Utility Functions

### Password Utilities (`src/utils/password.ts`)
- Password hashing and validation using bcrypt
- Secure password generation and verification

### Slug Generation (`src/utils/generateSlug.ts`)
- URL-friendly slug generation from strings
- Used for creating SEO-friendly identifiers

### File Schema (`src/utils/file-schema.ts`)
- File validation and schema definitions
- Handles file upload constraints and formats

## Data Transfer Objects (DTOs)

### Pagination (`src/utils/dtos/`)
- `PageOptionDto`: Query parameters for pagination
- `PageMetaDto`: Metadata for paginated responses
- `PageDto`: Complete paginated response structure

### Base DTO (`src/utils/base.dto.ts`)
- Common DTO structure for API responses
- Standardizes response format across endpoints

## TypeORM Configuration

### Data Source (`src/orm.datasource.ts`)

Database connection configuration:

```typescript
function buildDataSource(): DataSource {
  const dataSource = new DataSource({
    type: 'postgres',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    ssl: process.env.DB_DONTUSE_SSL ? false : { rejectUnauthorized: false },
  })
  return dataSource
}
```

**Features:**
- PostgreSQL database connection
- Automatic entity discovery
- Migration management
- SSL configuration for production

## Entity Services Overview

The application follows a modular approach with dedicated services for each domain:

### Core Entities
- **User Management**: `user.service.ts`, `student.service.ts`, `auth-manager.service.ts`
- **Educational Content**: `course.service.ts`, `lesson.service.ts`, `lesson-content.service.ts`
- **Organization**: `organization.service.ts`, `school.service.ts`, `class.service.ts`
- **Progress Tracking**: `course-progress.service.ts`, `student-progress-manager.service.ts`
- **Media Management**: `media.service.ts`, `lesson-content-file.service.ts`

### Helper Services
- **Authentication**: JWT strategy, Google Auth integration
- **Email Services**: SendGrid integration for notifications
- **File Storage**: S3 service for media management
- **Logging**: Activity logging and audit trails

## Database Migration Management

### Commands
```bash
# Show current migration status
yarn migration:show

# Run pending migrations
yarn migration:run

# Revert last migration
yarn migration:revert

# Create new migration
yarn migration:create

# Generate migration from entity changes
yarn migration:generate
```

### Migration Files
Located in `src/migrations/` with timestamps and descriptive names.

## Best Practices

1. **Always use BaseService**: Extend from BaseService for consistent CRUD operations
2. **Transaction Support**: Use EntityManager parameter for database transactions
3. **Type Safety**: Leverage TypeScript generics in BaseService
4. **Validation**: Implement DTOs with class-validator decorators
5. **Error Handling**: Use standardized error responses via base classes

## Environment Variables

### Database Configuration
- `DATABASE_URL`: Complete PostgreSQL connection string
- `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`: Individual connection parameters
- `DB_DONTUSE_SSL`: Disable SSL for local development

### External Services
- SendGrid API configuration
- AWS S3 credentials and bucket settings
- JWT secret and token configuration