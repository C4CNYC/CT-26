import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import invitesConfig from '@/config/invites.config'

import { StudentResetPassword } from '../../core/student-reset-password/student-reset-password.entity'
import { StudentResetPasswordService } from '../../core/student-reset-password/student-reset-password.service'
import { Student } from '../../core/student/student.entity'

@Injectable()
export class StudentResetPasswordManagerService {
  private readonly iConfig: ConfigType<typeof invitesConfig>

  constructor(
    private studentResetPasswordService: StudentResetPasswordService,
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

  async createResetPassword(student: Student): Promise<StudentResetPassword> {
    const expiresAt = this.getInvitationExpiredDate()
    return await this.studentResetPasswordService.create({
      studentId: student.id,
      student,
      expiresAt,
    })
  }

  async getResetPassword(id: string): Promise<StudentResetPassword> {
    const resetPassword = await this.studentResetPasswordService.findOne({
      where: { id },
      relations: { student: true },
    })
    if (
      !resetPassword ||
      resetPassword?.isUsed ||
      new Date(resetPassword.expiresAt) < new Date()
    )
      throw new NotFoundException('reset id invalid')
    await this.studentResetPasswordService.update(id, { isUsed: true })
    return resetPassword
  }
}
