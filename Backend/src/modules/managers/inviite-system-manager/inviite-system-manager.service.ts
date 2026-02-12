import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { CreateInviteDto } from '@/api/manager/invite-system-api/dtos/create-invite.dto'
import {
  AcceptInviteResponse,
  InviteInfoResponse,
} from '@/modules/core/invite-system/interfaces/invite-system.interface'
import { InviteSystemType } from '@/modules/core/invite-system/interfaces/invite-system.interface'
import { InviteSystemService } from '@/modules/core/invite-system/invite-system.service'
import { Role } from '@/modules/core/user/enums/role.enum'

import { SchoolMangerService } from '../school-manager/school-manager.service'
import { ApplicationEventEnum } from '../users-manager/enums/application-event'

@Injectable()
export class InviteSystemManagerService {
  constructor(
    private inviteSystemService: InviteSystemService,
    private schoolMangerService: SchoolMangerService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createInviteTeacherToSchool(
    createInviteData: CreateInviteDto,
    tenantName: string,
  ): Promise<void> {
    if (!createInviteData.schoolId) {
      throw new NotFoundException('School ID is required to invite a teacher')
    }
    if (!createInviteData.email) {
      throw new NotFoundException('Email is required to invite a teacher')
    }

    const invite = await this.inviteSystemService.createInvite({
      ...createInviteData,
      type: InviteSystemType.SCHOOL,
      role: Role.Manager,
      maxUses: 1,
    })

    if (!invite.code) {
      throw new NotFoundException('Something went wrong generating the invite')
    }

    const school = await this.schoolMangerService.getSchool(
      createInviteData.schoolId,
    )

    this.eventEmitter.emit(
      ApplicationEventEnum.INVITE_TEACHER_TO_SCHOOL,
      createInviteData.email,
      invite.code,
      tenantName,
      school.name,
    )
  }

  async acceptInviteTeacherToSchool(
    code: string,
    authUser: any | null,
  ): Promise<AcceptInviteResponse> {
    return await this.inviteSystemService.acceptInvite(code, authUser)
  }

  async getInvite(code: string): Promise<InviteInfoResponse> {
    const inviteData = await this.inviteSystemService.validateInvite(code)

    return {
      email: inviteData.email,
      type: inviteData.type,
      schoolId: inviteData.schoolId,
      classId: inviteData.classId,
      organizationId: inviteData.organizationId,
      inviteLink: `/invite-v2?code=${inviteData.code}`,
    }
  }
}
