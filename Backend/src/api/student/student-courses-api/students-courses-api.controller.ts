import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { Course } from '../../../modules/core/course/course.entity'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { MyCoursesSearchOptions } from './dtos/my-courses-search-options.dto'
import { CourseRatingDto } from './dtos/rating.dto'
import { StudentCoursesApiService } from './students-courses-api.services'

@ApiTags('Course API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student')
export class StudentCoursesApiController {
  constructor(private studentClasssesApiService: StudentCoursesApiService) {}

  @Get('/course')
  async getCourses(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: MyCoursesSearchOptions,
  ): Promise<PageDto<Course>> {
    return await this.studentClasssesApiService.getCourses(
      request.user?.studentID,
      page_options_dto,
      request.org_id,
    )
  }

  @Get('/course/:course_id')
  async getCourse(
    @Request() request: RequestWithMeta,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<Course> {
    return await this.studentClasssesApiService.getCourse(
      request.user?.studentID,
      course_id,
    )
  }

  @Get('/course/:course_id/modules')
  async getCourseModules(
    @Request() request: RequestWithMeta,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<CourseUnit[]> {
    return await this.studentClasssesApiService.getCourseModules(
      request.user?.studentID,
      course_id,
    )
  }

  @Get('/modules/:module_id/lessons')
  async getCourseLessons(
    @Request() request: RequestWithMeta,
    @Param('module_id', new ParseUUIDPipe()) module_id: string,
  ): Promise<Lesson[]> {
    return await this.studentClasssesApiService.getCourseLessons(
      request.user?.studentID,
      module_id,
    )
  }

  @Patch('/course/:course_id/like/add')
  async addLike(
    @Request() request: RequestWithMeta,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<MessageDto> {
    return await this.studentClasssesApiService.addLike(
      request.user.studentID,
      course_id,
    )
  }

  @Patch('/course/:course_id/like/remove')
  async removeLike(
    @Request() request: RequestWithMeta,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<MessageDto> {
    return await this.studentClasssesApiService.removeLike(
      request.user.studentID,
      course_id,
    )
  }

  @Patch('/course/:course_id/rating')
  async addRating(
    @Request() request: RequestWithMeta,
    @Body() dto: CourseRatingDto,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<MessageDto> {
    return await this.studentClasssesApiService.updateRating(
      request.user.studentID,
      course_id,
      dto,
    )
  }

  @Get('/course/:course_id/content')
  async getCourseContent(
    @Request() request: RequestWithMeta,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<Course> {
    return await this.studentClasssesApiService.getCourseContent(
      request.user?.studentID,
      course_id,
    )
  }
}
