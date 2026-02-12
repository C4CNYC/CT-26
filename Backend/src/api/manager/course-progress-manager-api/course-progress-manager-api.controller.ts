import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { CourseProgress } from '../../../modules/core/course-progress/course-progress.entity'
import { Course } from '../../../modules/core/course/course.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseProgressManagerApiService } from './course-progress-manager-api.service'
import { CourseProgressSearch } from './dtos/course-progress-search'

@ApiTags('Course Progress API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/course/:id/progress')
export class CourseProgressManagerApiController {
  constructor(
    private courseProgressManagerApiService: CourseProgressManagerApiService,
  ) {}
  @Get()
  async getCourseProgressList(
    @Query() dto: CourseProgressSearch,
  ): Promise<PageDto<CourseProgress>> {
    return await this.courseProgressManagerApiService.getCourseProgressList(dto)
  }

  @Get('/content')
  async getCourseProgressContent(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Course> {
    return await this.courseProgressManagerApiService.getCourseProgressContent(
      id,
    )
  }
}
