import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { GetFilesDto } from '@/api/student/student-workspace-api/dtos/get-files.dto'
import { Course } from '@/modules/core/course/course.entity'
import { StudentCoursesManagerService } from '@/modules/managers/student-manager/courses-student-manager/courses-student-manager.service'
import { WorkspaceManagerService } from '@/modules/managers/workspace-manager/workspace-manager.service'

@ApiTags('Workspace API (PUBLIC)')
@Controller('public/workspace')
export class WorkspacePublicApiController {
  constructor(
    private workspaceManagerService: WorkspaceManagerService,
    private studentCoursesManagerService: StudentCoursesManagerService,
  ) {}

  @Get()
  async getWorkspaceFiles(@Query() dto: GetFilesDto) {
    return await this.workspaceManagerService.getFilesByUnauthUser(
      dto.lessonContentId,
      dto.lessonId,
    )
  }

  @Get('/course/:course_id/content')
  async getCourseContent(
    @Param('course_id', new ParseUUIDPipe()) course_id: string,
  ): Promise<Course> {
    return await this.studentCoursesManagerService.getCourseContent(
      undefined,
      course_id,
    )
  }
}
