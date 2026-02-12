import { Module } from '@nestjs/common'

import { LessonModule } from '../../../modules/core/lesson/lesson.module'
import { UserModule } from '../../../modules/core/user/user.module'
import { LessonApiController } from './lesson-api.controller'
import { LessonApiService } from './lesson-api.service'

@Module({
  imports: [LessonModule, UserModule],
  providers: [LessonApiService],
  controllers: [LessonApiController],
})
export class LessonApiModule {}
