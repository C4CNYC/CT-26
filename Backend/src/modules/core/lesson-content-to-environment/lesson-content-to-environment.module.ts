import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonContentToEnvironment } from './lesson-content-to-environment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LessonContentToEnvironment])],
  exports: [TypeOrmModule],
})
export class LessonContentToEnvironmentModule {}