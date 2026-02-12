import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import {
  AcceptInviteResponse,
  InviteInfoResponse,
} from '@/modules/core/invite-system/interfaces/invite-system.interface'
import { OptionalJwtAuthGuard } from '@/old-auth/guards/optional-jwt-auth.guard'

import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { AcceptInviteDto } from './dtos/accept-invite.dto'
import { CreateInviteDto } from './dtos/create-invite.dto'
import { InviteSystemApiService } from './invite-system-api.service'

@ApiTags('Invites')
@UseGuards(OptionalJwtAuthGuard)
@Controller('invite-v2')
export class InviteSystemApiController {
  constructor(private readonly inviteSystemService: InviteSystemApiService) {}

  @Post('create-invite-teacher-to-school')
  @ApiOperation({ summary: 'Create new invite' })
  async createInviteTeacherToSchool(
    @Body() dto: CreateInviteDto,
    @Request() request: RequestWithMeta,
  ) {
    return await this.inviteSystemService.createInviteTeacherToSchool(
      { ...dto },
      request.org_name,
    )
  }

  @Post('accept')
  @ApiOperation({ summary: 'Accept invite' })
  async acceptInviteTeacherToSchool(
    @Body() dto: AcceptInviteDto,
    @Request() request: RequestWithMeta,
  ): Promise<AcceptInviteResponse> {
    console.log('acceptInviteTeacherToSchool request.user:', request.user)
    return await this.inviteSystemService.acceptInviteTeacherToSchool(
      dto.code,
      request.user,
    )
  }

  @Get()
  async getInvite(@Query('code') code: string): Promise<InviteInfoResponse> {
    if (!code) {
      throw new NotFoundException('Invite code is required')
    }
    return await this.inviteSystemService.getInvite(code)
  }
}
