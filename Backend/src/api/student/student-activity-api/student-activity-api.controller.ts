import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Role } from '@/modules/core/user/enums/role.enum'
import { ActivityManagerService } from '@/modules/managers/activity-manager/activity-manager.service'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { MessageDto } from '@/utils/dtos/message.dto'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { SetActiveClassDto } from './dtos/set-active-class.dto'

@ApiTags('Activity API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/activity')
export class StudenActivityApiController {
  constructor(private activityManagerService: ActivityManagerService) {}

  @Get()
  async getLastActiveClassId(
    @Request() request: RequestWithMeta,
  ): Promise<{ lastActiveTribe: string | null }> {
    return await this.activityManagerService.getLastActiveClassId(
      request.user.id,
    )
  }

  @Post()
  async setLastActiveClass(
    @Request() request: RequestWithMeta,
    @Body() dto: SetActiveClassDto,
  ): Promise<MessageDto> {
    return await this.activityManagerService.setActiveClass(
      dto.class_id,
      request.user.id,
    )
  }

  @Post('/workspace-query')
  async setLastWorkspaceQuery(
    @Request() request: RequestWithMeta,
    @Body() dto: { query: string },
  ): Promise<MessageDto> {
    return await this.activityManagerService.setLastWorkspaceQuery(
      request.user.id,
      dto.query,
    )
  }

  @Get('/workspace-query')
  async getLastWorkspaceQuery(
    @Request() request: RequestWithMeta,
  ): Promise<{ lastWorkspaceQuery: string | null }> {
    return await this.activityManagerService.getLastWorkspaceQuery(
      request.user.id,
    )
  }
}
