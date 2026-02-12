import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { AuthUser } from '@/old-auth/decorators/user.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseUnitSearchOptions } from './dtos/module-unit-search-options.dto'
import { ModuleUnitAdminApiService } from './module-api.service'

@ApiTags('Course Unit API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/module')
export class ModuleAdminApiController {
  constructor(private moduleUnitManagerApiService: ModuleUnitAdminApiService) {}
  @Get()
  async getCourseUnitList(
    @Request() request: RequestWithMeta,
    @Query() dto: CourseUnitSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<CourseUnit>> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.moduleUnitManagerApiService.getCourseUnitList(
      userId,
      dto,
      request.school_id,
    )
  }

  @Get('/own')
  async getOwnCourseUnitList(
    @Query() dto: CourseUnitSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<CourseUnit>> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.moduleUnitManagerApiService.getOwnCourseUnitList(
      userId,
      dto,
    )
  }
}
