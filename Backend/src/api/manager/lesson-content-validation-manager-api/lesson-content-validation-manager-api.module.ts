import { Module } from '@nestjs/common'

import { LessonContentModule } from '../../../modules/core/lesson-content/lesson-content.module'
import { LessonContentValidationManagerModule } from '../../../modules/managers/lesson-content-validation-manager/lesson-content-validation-manager.module'
import { LessonContentManagerApiController } from './lesson-content-validation-manager-api.controller'
import { LessonContentValidationManagerApiService } from './lesson-content-validation-manager-api.service'

@Module({
  imports: [LessonContentValidationManagerModule, LessonContentModule],
  providers: [LessonContentValidationManagerApiService],
  controllers: [LessonContentManagerApiController],
})
export class LessonContentValidationManagerApiModule {}
