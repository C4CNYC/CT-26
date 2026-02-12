import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonContentValidator } from './lesson-content-validator.entity'
import { LessonContentValidatorService } from './lesson-content-validator.service'

@Module({
  imports: [TypeOrmModule.forFeature([LessonContentValidator])],
  providers: [LessonContentValidatorService],
  exports: [LessonContentValidatorService],
})
export class LessonContentValidatorModule {}
