# CT-Middleware 
CT-Middleware is a NestJS-based educational platform backend that manages courses, lessons, students, schools, and organizations with multi-tenant architecture.
Detailed information can be found under `/docs` folder

## Technology Stack
 TypeScript, NestJS (Node.js), PostgreSQL with TypeORM, JWT + Google OAuth, AWS S3, SendGrid, OpenAI integration

### User Management
- Multi-role system (Students, Teachers, Admins, Super Admins)
- Organization and school-based tenancy
- Google authentication integration
- Password reset functionality

### Educational Content
- Course creation and management
- Lesson content with multimedia support
- Assignment system with code execution
- Progress tracking and analytics
- Course ratings and certificates

### Organization Management
- Multi-tenant architecture
- School and class management
- Teacher-student relationships
- Invitation system

### Media & Files
- S3-based file storage
- Image and document management
- Tenant-isolated file paths

## Architecture

### Layered Structure
```
API Controllers → Manager Services → Core Services → Database Entities
```

### Key Patterns
- **Base Classes**: All entities extend BaseEntity, services extend BaseService
- **DTOs**: Request/response validation using class-validator
- **Guards**: JWT and role-based authentication
- **Modules**: Feature-based modular organization

## Database Schema

### Core Entities
- `User` - System users with roles
- `Student` - Student-specific data
- `Organization` - Tenant organizations
- `School` - Educational institutions
- `Class` - Student groups
- `Course` - Educational courses
- `Lesson` - Individual lessons
- `LessonContent` - Lesson materials
- `Assignment` - Student assignments
- `CourseProgress` - Progress tracking

## API Structure

### Admin APIs
- Course management
- User administration
- School configuration
- System properties

### Manager APIs
- Content creation/editing
- Progress monitoring
- Media management
- Analytics

### Student APIs
- Course enrollment
- Lesson access
- Assignment submission
- Social features

### Public APIs
- Tenant information
- Webhooks (payments)
- Access control

## Development

### Scripts
```bash
yarn start:dev     # Development server
yarn build         # Production build
yarn migration:run # Run database migrations
yarn test          # Run tests
```

### Environment Variables
- Database connection (PostgreSQL)
- AWS S3 credentials
- SendGrid API key
- JWT secrets
- OpenAI API key

## Key Services

### Authentication
- JWT token management
- Google OAuth integration
- Role-based access control

### Content Management
- Lesson creation/validation
- Media upload/processing
- Assignment grading

### Progress Tracking
- Course completion
- Student analytics
- Performance metrics

### External Integrations
- Google Classroom
- OpenAI for content generation
- Stripe for payments

## Related Files

### User Management
- Entity: `src/modules/core/user/user.entity.ts`
- Auth: `src/old-auth/auth.service.ts`
- Google Auth: `src/providers/google-auth/`

### Student System
- Entity: `src/modules/core/student/student.entity.ts`
- Service: `src/modules/core/student/student.service.ts`
- APIs: `src/api/student/`

### Educational Content
- Course: `src/modules/core/course/course.entity.ts`
- Lesson: `src/modules/core/lesson/lesson.entity.ts`
- Content: `src/modules/core/lesson-content/lesson-content.entity.ts`
- APIs: `src/api/manager/course-manager-api/`, `src/api/manager/lesson-manager-api/`

### Organization Management
- Entity: `src/modules/core/organization/organization.entity.ts`
- School: `src/modules/core/school/school.entity.ts`
- Class: `src/modules/core/class/class.entity.ts`
- APIs: `src/api/admin/organization-api/`, `src/api/admin/school-api/`

### Assignment System
- Entity: `src/modules/core/assigment/assigment.entity.ts`
- Code Assignment: `src/modules/core/code-assignment/code-assignment.entity.ts`
- APIs: `src/api/manager/school-assigment-manager-api/`

### Progress Tracking
- Entity: `src/modules/core/course-progress/course-progress.entity.ts`
- Activity: `src/modules/core/user-activity/user-activity.entity.ts`
- Log: `src/modules/core/log-activity/log-activity.entity.ts`
- APIs: `src/api/manager/course-progress-manager-api/`

### Course Ratings & Certificates
- Rating: `src/modules/core/course-rating/course-rating.entity.ts`
- Certificate: `src/modules/core/course-certificate/course-certificate.entity.ts`
- Like: `src/modules/core/course-like/course-like.entity.ts`

### Teacher-Student Relationships
- Class: `src/modules/core/class/class.entity.ts`
- Invitation: `src/modules/core/invitation/invitation.entity.ts`
- Student Invitation: `src/modules/core/student-invitation/student-invitation.entity.ts`

### Invitation System
- Entity: `src/modules/core/invitation/invitation.entity.ts`
- Student: `src/modules/core/student-invitation/student-invitation.entity.ts`
- Manager: `src/modules/managers/invitations-manager/`

### Media & File Storage
- Entity: `src/modules/core/media/media.entity.ts`
- Lesson Files: `src/modules/core/lesson-content-file/lesson-content-file.entity.ts`
- Student Files: `src/modules/core/student-lesson-file/student-lesson-file.entity.ts`
- S3 Service: `src/providers/s3/`
- APIs: `src/api/manager/media-manager-api/`

### Multi-tenant Architecture
- Organization: `src/modules/core/organization/organization.entity.ts`
- Tenant Config: `src/utils/tenant-configs/`
- Public API: `src/api/public/tenant-public-api/`
- Middleware: `src/middlewares/org.middleware.ts`

### Authentication & Authorization
- JWT Strategy: `src/old-auth/strategies/jwt.strategy.ts`
- Guards: `src/old-auth/guards/`
- Google OAuth: `src/providers/google-auth/`
- Access Control: `src/modules/core/access-control/access-control.entity.ts`

### Content Creation & Editing
- Lesson Manager: `src/modules/managers/lesson-manager/`
- Content Manager: `src/modules/managers/lesson-content-manager/`
- Course Manager: `src/modules/managers/course-manager/`
- APIs: `src/api/manager/`

### Analytics & Monitoring
- Stats: `src/api/manager/stats-manager-api/`
- Activity: `src/modules/core/user-activity/user-activity.entity.ts`
- Log Activity: `src/modules/core/log-activity/log-activity.entity.ts`

### Payment Webhooks
- Stripe Entity: `src/modules/core/webhooks/stripe.entity.ts`
- Webhook API: `src/api/public/webhooks/`
- Payment Manager: `src/modules/managers/webhooks-manager/`

### Database & Migrations
- Datasource: `src/orm.datasource.ts`
- Migrations: `src/migrations/`
- Base Entity: `src/utils/base/base.entity.ts`