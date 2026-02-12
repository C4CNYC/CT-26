import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import invitesConfig from '@/config/invites.config'

import { Invitation } from '../../core/invitation/invitation.entity'
import { InvitationService } from '../../core/invitation/invitations.service'
import { User } from '../../core/user/user.entity'

@Injectable()
export class InvitationsManagerService {
  private readonly iConfig: ConfigType<typeof invitesConfig>
  constructor(
    private invitationService: InvitationService,
    @Inject(invitesConfig.KEY)
    iConfig: ConfigType<typeof invitesConfig>,
  ) {
    this.iConfig = iConfig
  }

  getInvitationExpiredDate(): string {
    return new Date(
      Date.now() + +this.iConfig.inviteUserTtl * 1000,
    ).toISOString()
  }

  async createInvitation(user: User): Promise<Invitation> {
    const expiresAt = this.getInvitationExpiredDate()
    return await this.invitationService.create({
      user,
      userId: user.id,
      expiresAt,
    })
  }

  async getInvitation(id: string): Promise<Invitation> {
    const invite = await this.invitationService.findOne({
      where: { id },
      relations: { user: true },
    })
    if (!invite || invite.isUsed || new Date(invite.expiresAt) < new Date())
      throw new ConflictException('invite link is invalid')
    return invite
  }
}
