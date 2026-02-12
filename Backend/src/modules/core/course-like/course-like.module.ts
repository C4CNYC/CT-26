import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CourseLike } from './course-like.entity'
import { CourseLikeService } from './course-like.service'

@Module({
  imports: [TypeOrmModule.forFeature([CourseLike])],
  providers: [CourseLikeService],
  exports: [CourseLikeService],
})
export class CourseLikeModule {}
