import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

import { ClassService } from '../../../modules/core/class/class.service'
import { Course } from '../../../modules/core/course/course.entity'
import { LessonContent } from '../../../modules/core/lesson-content/lesson-content.entity'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { StudentProject } from '../../../modules/core/student-project/student-project.entity'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { MyCoursesSearchOptions } from './dtos/my-courses-search-options.dto'
import { StudentPublicApiService } from './student-public-api.services'

@ApiTags('Public API (STUDENT)')
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/public')
export class StudentPublicApiController {
  constructor(
    private studentPublicApiService: StudentPublicApiService,
    private classService: ClassService,
  ) {}

  @Get('/lesson')
  async searchLesson(
    @Query() dto: { slug: string }, //LessonSearchOptions,
  ): Promise<PageDto<Lesson>> {
    console.log('slug', dto.slug)
    return await this.studentPublicApiService.getPublicLessonFromSlug(dto)
  }
  @Get('/course')
  async getCourses(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: MyCoursesSearchOptions,
  ): Promise<PageDto<Course>> {
    return await this.studentPublicApiService.getCourses(
      page_options_dto,
      request.org_id,
    )
  }

  @Get('/class/:id')
  async getClass(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.classService.getClass(id)
  }

  @Get('/course/:course_id/lesson/:id')
  async getLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<Lesson> {
    return await this.studentPublicApiService.getLesson(course_id, id)
  }

  @Get('/course/:course_id/content')
  async getContent(
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<Course> {
    return await this.studentPublicApiService.getCourseContent(course_id)
  }

  @Get('/module/:module_id/content')
  async getModuleContent(
    @Param('module_id', new ParseUUIDPipe()) module_id: string,
  ): Promise<Course> {
    return await this.studentPublicApiService.getModuleContentList(module_id)
  }

  @Get('/course/:course_id/:id/content')
  async getLessonContent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<LessonContent[]> {
    return await this.studentPublicApiService.getLessonContentList(
      course_id,
      id,
    )
  }

  @Get('/project/:id')
  async getProject(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StudentProject> {
    return await this.studentPublicApiService.getProject(id)
  }
}
