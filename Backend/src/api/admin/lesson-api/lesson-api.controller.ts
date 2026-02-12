import {
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

import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { PageDto } from '../../../utils/dtos/page.dto'
import { LessonSearchOptions } from './dtos/lesson-search-option.dto'
import { LessonApiService } from './lesson-api.service'

@ApiTags('Classes API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/lesson')
export class LessonApiController {
  constructor(private lessonApiService: LessonApiService) {}

  @Get()
  async getLessons(
    @AuthUser() userId: string,
    @Query() dto: LessonSearchOptions,
    @Request() req: RequestWithMeta,
  ): Promise<PageDto<Lesson>> {
    return await this.lessonApiService.getLessons(dto)
  }

  @Get('/all')
  async getAdminLessons(
    @AuthUser() userId: string,
    @Query() dto: LessonSearchOptions,
    @Request() req: RequestWithMeta,
  ): Promise<PageDto<Lesson>> {
    return await this.lessonApiService.getAdminLessons(
      userId,
      dto,
      req.school_id,
    )
  }
}
