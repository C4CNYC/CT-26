/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

import { PageDto } from '@/utils/dtos/page.dto'

import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { LessonSearchOptions } from './dtos/lesson-search-option.dto'
import { LessonManagerApiService } from './lesson-manager-api.service'

//   import { AuthUser } from '@/old-auth/decorators/user.decorator'
//   import { Integration } from '../../../modules/core/integration/integration.entity'
//   import { Skill } from '../../../modules/core/skills/skill.entity'
//   import { CreateLessonUsingOpenAIAssistantProps } from '@/modules/managers/lesson-manager/lesson-manager.service'

@ApiTags('Lesson API (Public)')
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('public/lesson')
export class LessonPublicApiController {
  constructor(private lessonManagerApiService: LessonManagerApiService) {}

  @Get()
  async searchLesson(
    @Query() dto: LessonSearchOptions,
  ): Promise<PageDto<Lesson>> {
    if (dto?.slug) {
      throw new BadRequestException('Slug not found in request.')
    }
    return await this.lessonManagerApiService.getPublicLessonList(dto)
  }
  @Get('/:id')
  async getLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Lesson> {
    return await this.lessonManagerApiService.getLesson(id)
  }

  @Get('/checkSlug/:slug')
  async checkSlug(@Param('slug') slug: string): Promise<boolean> {
    return await this.lessonManagerApiService.checkSlug(slug)
  }
}
