import { Injectable } from '@nestjs/common'

import {
  AcceptInviteResponse,
  InviteInfoResponse,
} from '@/modules/core/invite-system/interfaces/invite-system.interface'
import { InviteSystemManagerService } from '@/modules/managers/inviite-system-manager/inviite-system-manager.service'

import { MessageDto } from '../../../utils/dtos/message.dto'
import { CreateInviteDto } from './dtos/create-invite.dto'

@Injectable()
export class InviteSystemApiService {
  constructor(private inviteSystemManagerService: InviteSystemManagerService) {}

  async createInviteTeacherToSchool(
    dto: CreateInviteDto,
    tenantName: string,
  ): Promise<MessageDto> {
    await this.inviteSystemManagerService.createInviteTeacherToSchool(
      dto,
      tenantName,
    )

    return new MessageDto('Invite created successfully')
  }

  async acceptInviteTeacherToSchool(
    code: string,
    authUser: any,
  ): Promise<AcceptInviteResponse> {
    return await this.inviteSystemManagerService.acceptInviteTeacherToSchool(
      code,
      authUser,
    )
  }

  async getInvite(code: string): Promise<InviteInfoResponse> {
    return await this.inviteSystemManagerService.getInvite(code)
  }
}
