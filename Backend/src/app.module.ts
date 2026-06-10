import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FeedbackModule } from '@/api/feedback/feedback.module'
import { JokesModule } from '@/providers/jokes/jokes.module'
import { UnsplashModule } from '@/providers/unsplash/unsplash.module'
import { OldAuthUserApiModule } from '@/api/old-auth/old-auth-user-api.module'
import { PublicApiModule } from '@/api/public/public-api.module'
import { LessonLastSlideModule } from '@/api/student/lesson-last-slide/lesson-last-slide.module'
import codeConfig from '@/config/code.config'
import { UserModule } from '@/modules/core/user/user.module'

import { AdminApiModule } from './api/admin/admin-api.module'
import { ManagerApiModule } from './api/manager/manager-api.module'
import { StudentApiModule } from './api/student/student-api.module'
import { SuperAdminApiModule } from './api/super-admin/super-admin-api.module'
import appConfig from './config/app.config'
import authConfig from './config/auth.config'
import invitesConfig from './config/invites.config'
import { LoggerModule } from './logger/logger.module'
import { TypeormLoggerService } from './logger/typeorm-logger.service'
import { OrgMiddleware } from './middlewares/org.middleware'
import { EmailsManagerModule } from './modules/managers/emails-manager/emails-manager.module'
console.log('DB_DEV:', process.env.DATABASE_URL);
@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      load: [appConfig, invitesConfig, authConfig, codeConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [LoggerModule],
      inject: [TypeormLoggerService],
      useFactory: (logger: TypeormLoggerService) => ({
        type: 'postgres',
        ...(process.env.DATABASE_URL
          ? { url: process.env.DATABASE_URL }
          : {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
          }),
        ...{
          ...(process.env.DB_DONTUSE_SSL
            ? {}
            : { ssl: { rejectUnauthorized: false } }),
        },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        logger: logger,
        logging: ['query', 'error', 'warn', 'info'],
        maxQueryExecutionTime: 100,
        ssl:
          process.env.DB_DONTUSE_SSL
            ? false
            : { rejectUnauthorized: false },
        // Connection pooling configuration
        extra: {
          max: 20, // Maximum number of connections in pool
          min: 5,  // Minimum number of connections in pool
          idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
          connectionTimeoutMillis: 10000, 
          acquireTimeoutMillis: 60000, // Return an error after 60 seconds if connection could not be acquired
        },
      }),
    }),
    UserModule,
    FeedbackModule,
    AdminApiModule,
    StudentApiModule,
    ManagerApiModule,
    PublicApiModule,
    SuperAdminApiModule,
    OldAuthUserApiModule,
    LessonLastSlideModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    EmailsManagerModule,
    JokesModule,
    UnsplashModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(OrgMiddleware)
      .exclude('tenant/:slug', 'health', 'unsplash/(.*)', 'jokes/(.*)')
      .exclude({ path: 'payment/stripe', method: RequestMethod.ALL })
      .forRoutes('*')
  }
}
