import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { OptionalJwtAuthGuard } from '@/old-auth/guards/optional-jwt-auth.guard'

import { LessonContent } from '../../../modules/core/lesson-content/lesson-content.entity'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { LastVisitedData } from '../../../modules/core/student/interfaces'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { LastVisitedUnitAndLessonDto } from '../../manager/school-student-manager-api/dtos/last-visited-unit-and-lesson.dto'
import {
  LessonWithCoursePlacement,
  StudentLessonsApiService,
} from './students-lessons-api.services'

@ApiTags('Lesson API (STUDENT)')
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/lesson')
export class StudentModulesApiController {
  constructor(private studentLessonsApiService: StudentLessonsApiService) {}

  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
  @Get(':course_id/last-visited')
  async getLastVisitedData(
    @Request() request: RequestWithMeta,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<LastVisitedData> {
    return await this.studentLessonsApiService.getLastVisitedData(
      request.user?.studentID,
      course_id,
    )
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getLesson(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Lesson> {
    return await this.studentLessonsApiService.getLesson(
      request.user?.studentID,
      id,
    )
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('without-contents/:id')
  async getLessonWithoutContent(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<LessonWithCoursePlacement> {
    return await this.studentLessonsApiService.getLessonWithoutContent(
      request.user?.studentID,
      id,
    )
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/content')
  async getLessonContent(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<LessonContent[]> {
    return await this.studentLessonsApiService.getLessonContentList(
      request.user?.studentID,
      id,
    )
  }

  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
  @Patch('last-visited')
  async updateLastVisitedData(
    @Request() request: RequestWithMeta,
    @Body() dto: LastVisitedUnitAndLessonDto,
  ): Promise<MessageDto> {
    return await this.studentLessonsApiService.updateLastVisitedData(
      request.user?.studentID,
      dto,
    )
  }
}
