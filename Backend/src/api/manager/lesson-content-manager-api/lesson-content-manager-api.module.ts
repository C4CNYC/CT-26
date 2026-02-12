import { Module } from '@nestjs/common'

import { EnvironmentsModule } from '../environments/environments.module'
import { LessonContentManagerModule } from '../../../modules/managers/lesson-content-manager/lesson-content-manager.module'
import { LessonContentManagerApiController } from './lesson-content-manager-api.controller'
import { LessonContentManagerApiService } from './lesson-content-manager-api.service'

@Module({
  imports: [LessonContentManagerModule, EnvironmentsModule],
  providers: [LessonContentManagerApiService],
  controllers: [LessonContentManagerApiController],
})
export class LessonContentManagerApiModule {}
