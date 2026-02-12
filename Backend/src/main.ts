import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import compression from 'compression'

import { AppConfig } from '@/config/app.config'
import { AuthConfig } from '@/config/auth.config'
import { Loglevel } from '@/config/loglevel.enum'
import { ConsoleLoggerService } from '@/logger/console-logger.service'

import { setupApp } from './app-init'
import { AppModule } from './app.module'
import { MemoryUsageInterceptor } from './MemoryUsageInterceptor'
import { NextFunction } from 'express'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    // ConsoleLoggerService only uses the loglevel, so we can give it an incomplete AppConfig to log everything
    // This Logger instance will be replaced by a proper one with config from DI below
    logger: new ConsoleLoggerService({ loglevel: Loglevel.TRACE } as AppConfig),
  })

  // Set up our custom logger
  const logger = await app.resolve(ConsoleLoggerService)
  logger.log('Switching logger', 'AppBootstrap')
  app.useLogger(logger)

  // Initialize config and abort if we don't have a valid config
  const configService = app.get(ConfigService)
  const appConfig = configService.get<AppConfig>('appConfig')
  const authConfig = configService.get<AuthConfig>('authConfig')

  if (!appConfig || !authConfig) {
    logger.error('Could not initialize config, aborting.', 'AppBootstrap')
    process.exit(1)
  }
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`Incoming request: ${req.method} ${req.url}`, 'HTTP')
    next()
  })

  await setupApp(app, appConfig, authConfig, logger)

  app.useGlobalInterceptors(new MemoryUsageInterceptor())
  app.use(
    compression({
      level: 6, // Compression level (0-9), higher is better&slower
      threshold: 1024 * 2, //compress if bigger than 2Kb
    }),
  )


  await app.listen(appConfig.port)
  logger.warn(`Listening on port ${appConfig.port}`, 'AppBootstrap')
}

void bootstrap()
