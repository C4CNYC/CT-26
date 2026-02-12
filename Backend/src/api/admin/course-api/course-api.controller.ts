import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
import { MessageDto } from '@/utils/dtos/message.dto'

import { Course } from '../../../modules/core/course/course.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { CourseApiService } from './course-api.service'
import { AdminCourseCatalogDto } from './dtos/admin-course-catalog.dto'
import { CourseSearchOptions } from './dtos/course-search-options.dto'

@ApiTags('Course API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/course')
export class CourseApiController {
  constructor(private courseApiService: CourseApiService) {}

  @Get()
  async getCourses(
    @Request() request: RequestWithMeta,
    @Query() pageOptionsDto: CourseSearchOptions,
  ): Promise<PageDto<Course>> {
    return await this.courseApiService.getListFromCatalog(
      pageOptionsDto,
      request.org_id,
    )
  }

  @Get('/global')
  async getGlobalCoursesFromCatalogByOrg(
    @Request() request: RequestWithMeta,
    @Query() pageOptionsDto: CourseSearchOptions,
  ): Promise<PageDto<Course>> {
    return await this.courseApiService.getListGlobalCoursesFromCatalogByOrg(
      pageOptionsDto,
      request.org_id,
    )
  }

  @Patch('/catalog/:id')
  async updateAdminGlobalCourseInCatalogByOrg(
    @Request() request: RequestWithMeta,
    @Param('id') id: string,
    @Body()
    body: AdminCourseCatalogDto,
  ): Promise<MessageDto> {
    const org_id = body.org_id || request.org_id

    await this.courseApiService.updateAdminGlobalCourseInCatalogByOrg(
      org_id,
      id,
      body.is_show_in_catalog,
    )

    return new MessageDto('Course visibility updated successfully')
  }

  @Get('/own')
  async getOwnCourses(
    @Query() page_options_dto: CourseSearchOptions,
    @Request() request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    return await this.courseApiService.getOwnList({
      ...page_options_dto,
      user_id: request.user.id,
    } as CourseSearchOptions)
  }
}
