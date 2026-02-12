import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import invitesConfig from '@/config/invites.config'

import { UserResetPassword } from '../../core/user-reset-password/user-reset-password.entity'
import { UserResetPasswordService } from '../../core/user-reset-password/user-reset-password.service'
import { User } from '../../core/user/user.entity'

@Injectable()
export class UserResetPasswordManagerService {
  private readonly iConfig: ConfigType<typeof invitesConfig>

  constructor(
    private userResetPasswordService: UserResetPasswordService,
    @Inject(invitesConfig.KEY)
    iConfig: ConfigType<typeof invitesConfig>,
  ) {
    this.iConfig = iConfig
  }

  getInvitationExpiredDate(): string {
    return new Date(
      Date.now() + +this.iConfig.resetPasswordTtl * 1000,
    ).toISOString()
  }

  async createResetPassword(user: User): Promise<UserResetPassword> {
    const expiresAt = this.getInvitationExpiredDate()
    return await this.userResetPasswordService.create({
      user,
      userId: user.id,
      expiresAt,
    })
  }
  async getResertPasswordUser(id: string): Promise<User> {
    const resetPassword = await this.userResetPasswordService.findOne({
      where: { id },
      relations: { user: true },
    })
    if (
      !resetPassword ||
      resetPassword?.isUsed ||
      new Date(resetPassword.expiresAt) < new Date()
    )
      throw new NotFoundException('reset id invalid') 
    return resetPassword.user
  }

  async getResetPassword(id: string): Promise<UserResetPassword> {
    const resetPassword = await this.userResetPasswordService.findOne({
      where: { id },
      relations: { user: true },
    })
    if (
      !resetPassword ||
      resetPassword?.isUsed ||
      new Date(resetPassword.expiresAt) < new Date()
    )
      throw new NotFoundException('reset id invalid')
    await this.userResetPasswordService.update(id, { isUsed: true })
    return resetPassword
  }
}
