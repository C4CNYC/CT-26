import { registerAs } from '@nestjs/config'

export interface InvitesConfig {
  inviteUserTtl: number
  resetPasswordTtl: number
  inviteStudentTtl: number
}

export default registerAs('invitesConfig', () => {
  return {
    inviteUserTtl: process.env.INVITE_USER_TTL as unknown as number,
    resetPasswordTtl: process.env.RESET_PASSWORD_TTL as unknown as number,
    inviteStudentTtl: process.env.INVITE_STUDENT_TTL as unknown as number,
  } as InvitesConfig
})
