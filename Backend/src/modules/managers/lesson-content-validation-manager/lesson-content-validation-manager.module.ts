import { Module } from '@nestjs/common'

import { LessonContentValidatorModule } from '../../core/lesson-content-validator/lesson-content-validator.module'
import { LessonContentValidationManagerService } from './lesson-content-validation-manager.service'

@Module({
  imports: [LessonContentValidatorModule],
  providers: [LessonContentValidationManagerService],
  exports: [LessonContentValidationManagerService],
})
export class LessonContentValidationManagerModule {}
