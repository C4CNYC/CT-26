import { INestApplication } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'

import { AuthConfig } from '@/config/auth.config'

import { AppConfig } from './config/app.config'
import { ErrorExceptionMapping } from './errors/error-mapping'
import { ConsoleLoggerService } from './logger/console-logger.service'
import { setupValidationPipe } from './utils/setup-pipes'
import { setupApiDocs } from './utils/swagger'

/**
 * Common setup function which is called by main.ts and the E2E tests.
 */
export async function setupApp(
  app: NestExpressApplication,
  appConfig: AppConfig,
  authConfig: AuthConfig,
  logger: ConsoleLoggerService,
): Promise<void> {
  // setupApiDocs(app)
  logger.log(`Serving OpenAPI docs for API under '/apidoc'`, 'AppBootstrap')

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
  logger.log(
    `Enabling CORS for '${appConfig.fallbackClientBaseUrl}'`,
    'AppBootstrap',
  )

  app.useGlobalPipes(setupValidationPipe(logger))

  await runMigrationsAndSeedRequiredData(app, logger)

  logger.log(
    `Serving the local folder 'public' under '/public'`,
    'AppBootstrap',
  )
  app.useStaticAssets('public', {
    prefix: '/public/',
  })

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new ErrorExceptionMapping(httpAdapter))
  app.enableShutdownHooks()
}

async function runMigrationsAndSeedRequiredData(
  app: INestApplication,
  logger: ConsoleLoggerService,
): Promise<void> {
  logger.log(
    `Running migrations and seeding required data for '${'public'}'`,
    'AppBootstrap',
  )

  const dataSource = app.get(DataSource)

  await dataSource.runMigrations()
}
