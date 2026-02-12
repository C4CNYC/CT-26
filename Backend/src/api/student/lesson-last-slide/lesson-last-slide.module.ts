import { Module } from '@nestjs/common'

import { LessonLastSlideServiceModule } from '@/modules/core/lesson-last-slide/lesson-last-slide.module'

import { LessonLastSlideApiService } from './lesson-last-slide-api.service'
import { LessonLastSlideController } from './lesson-last-slide.controller'

@Module({
  imports: [LessonLastSlideServiceModule],
  controllers: [LessonLastSlideController],
  providers: [LessonLastSlideApiService],
})
export class LessonLastSlideModule {}
