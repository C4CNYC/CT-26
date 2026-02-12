import { Module } from '@nestjs/common'

import { ConsoleLoggerService } from './console-logger.service'
import { TypeormLoggerService } from './typeorm-logger.service'

@Module({
  providers: [ConsoleLoggerService, TypeormLoggerService],
  exports: [ConsoleLoggerService, TypeormLoggerService],
})
export class LoggerModule {}
