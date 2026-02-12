import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { CreateLessonLastSlideDto } from '@/api/student/lesson-last-slide/dto/create-lesson-last-slide.dto'
import { Role } from '@/modules/core/user/enums/role.enum'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { LessonLastSlideApiService } from './lesson-last-slide-api.service'

@ApiTags('Lesson API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/lesson')
export class LessonLastSlideController {
  constructor(
    private readonly lessonLastSlideService: LessonLastSlideApiService,
  ) {}

  @Post('/last-slide')
  changeLastSlide(
    @Body() createLessonLastSlideDto: CreateLessonLastSlideDto,
    @Request() request: RequestWithMeta,
  ) {
    return this.lessonLastSlideService.changeSlide(
      createLessonLastSlideDto,
      request,
    )
  }

  @Get('/last-slide/:lessonId')
  getLastSlide(
    @Request() request: RequestWithMeta,
    @Param('lessonId', new ParseUUIDPipe()) lessonId: string,
  ) {
    return this.lessonLastSlideService.getSlide(lessonId, request)
  }
}
