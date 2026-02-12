import { Module } from '@nestjs/common'
import { StatsManagerService } from './stats.service'
import { TypeOrmModule } from '@nestjs/typeorm' 
import { User } from '@/modules/core/user/user.entity'
import { Lesson } from '@/modules/core/lesson/lesson.entity'
import { CourseProgress } from '@/modules/core/course-progress/course-progress.entity'
import { LogActivity } from '@/modules/core/log-activity/log-activity.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Lesson, CourseProgress, LogActivity])],
  providers: [StatsManagerService],
  exports: [StatsManagerService],
})
export class StatsManagerModule { }