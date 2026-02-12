import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'
import { Repository } from 'typeorm'

import { CreateInviteDto } from '@/api/manager/invite-system-api/dtos/create-invite.dto'
import {
  AcceptInviteResponse,
  InviteStatus,
} from '@/modules/core/invite-system/interfaces/invite-system.interface'
import { SchoolMangerService } from '@/modules/managers/school-manager/school-manager.service'

import { UserService } from '../user/user.service'
import { InviteSystemType } from './interfaces/invite-system.interface'
import { InviteSystem } from './invite-system.entity'

@Injectable()
export class InviteSystemService {
  constructor(
    @InjectRepository(InviteSystem)
    private readonly inviteRepo: Repository<InviteSystem>,
    private readonly userService: UserService,
    private readonly schoolManagerService: SchoolMangerService,
  ) {}

  private generateCode(prefix: string) {
    const token = randomBytes(6).toString('hex')
    return `${prefix}_${token}`
  }

  async createInvite(data: CreateInviteDto): Promise<InviteSystem> {
    const code = this.generateCode(data.role as string)

    const invite = this.inviteRepo.create({
      code,
      createdBy: data.createdBy,
      email: data.email ?? null,

      organizationId: data.organizationId ?? null,
      schoolId: data.schoolId ?? null,
      classId: data.classId ?? null,

      role: data.role,
      type: data.type,

      redirectUrl: data.redirectUrl ?? null,

      expiresAt: data.expiresAt ?? null,
      maxUses: data.maxUses ?? 1,
      uses: 0,
      isActive: true,
    })

    return await this.inviteRepo.save(invite)
  }

  async validateInvite(code: string) {
    const invite = await this.inviteRepo.findOne({ where: { code } })

    if (!invite) throw new NotFoundException('Invite not found')

    if (!invite.isActive) {
      throw new BadRequestException('Invite is no longer active')
    }

    if (invite.uses >= invite.maxUses) {
      throw new BadRequestException('Invite usage limit reached')
    }

    if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
      throw new BadRequestException('Invite has expired')
    }

    return invite
  }

  async acceptInvite(
    code: string,
    authUser: any,
  ): Promise<AcceptInviteResponse> {
    const invite = await this.validateInvite(code)
    const isAuthenticated = !!authUser

    if (!invite) {
      throw new NotFoundException('Invite not found')
    }

    const user = await this.userService.getUserByEmail(invite.email as string)

    if (!user) {
      return {
        status: InviteStatus.RegistrationNeeded,
        inviteType: invite.type,
        email: invite.email,
      }
    }

    if (!isAuthenticated) {
      return {
        status: InviteStatus.LoginNeeded,
        inviteType: invite.type,
        email: invite.email,
      }
    }

    await this.applyInviteAction(invite, user.id)

    invite.uses += 1
    if (invite.uses >= invite.maxUses) {
      invite.isActive = false
    }

    await this.inviteRepo.save(invite)

    return {
      status: InviteStatus.Success,
      schoolId: invite.schoolId,
      redirectUrl: invite.redirectUrl,
    }
  }

  applyInviteAction(invite: InviteSystem, userId: string) {
    switch (invite.type) {
      case InviteSystemType.ORGANIZATION:
        return this.applyOrganizationInvite(invite, userId)

      case InviteSystemType.SCHOOL:
        return this.applySchoolInvite(invite, userId)

      case InviteSystemType.CLASS:
        return this.applyClassInvite(invite, userId)

      default:
        throw new BadRequestException('Unknown invite type')
    }
  }

  private applyOrganizationInvite(invite: InviteSystem, userId: string) {
    if (!invite.organizationId) {
      throw new BadRequestException('Organization ID is missing for invite')
    }

    // return this.organizationService.addUserToOrganization({
    //   organizationId: invite.organizationId,
    //   userId,
    //   role: invite.role,
    // })
  }

  private applySchoolInvite(invite: InviteSystem, userId: string) {
    if (!invite.schoolId) {
      throw new BadRequestException('School ID is missing for invite')
    }

    return this.schoolManagerService.addTeacher(invite.schoolId, {
      user_id: userId,
    })
  }

  private applyClassInvite(invite: InviteSystem, userId: string) {
    if (!invite.classId) {
      throw new BadRequestException('Class ID is missing for invite')
    }

    // return this.classService.addUserToClass({
    //   classId: invite.classId,
    //   userId,
    //   role: invite.role,
    // })
  }
}
