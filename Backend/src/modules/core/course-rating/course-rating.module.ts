import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CourseRating } from './course-rating.entity'
import { CourseRatingService } from './course-rating.service'

@Module({
  imports: [TypeOrmModule.forFeature([CourseRating])],
  providers: [CourseRatingService],
  exports: [CourseRatingService],
})
export class CourseRatingModule {}
