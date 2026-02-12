import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonLastSlide } from '@/modules/core/lesson-last-slide/lesson-last-slide.entity'
import { LessonLastSlideService } from '@/modules/core/lesson-last-slide/lesson-last-slide.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonLastSlide])],
  providers: [LessonLastSlideService],
  exports: [LessonLastSlideService],
})
export class LessonLastSlideServiceModule {}
