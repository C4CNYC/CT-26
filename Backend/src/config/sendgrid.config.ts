import { registerAs } from '@nestjs/config'

export interface SendgridConfig {
  apiKey: string
  emailFrom: string
  nameFrom: string
  inviteTemplateId: string
  createOrgTemplateId: string
  createTenantTemplateId: string
  createStudentTemplateId: string
  inviteStudentCode: string
  inviteStudentTemplateId: string
  inviteToStreamTemplateId: string
  resetPasswordStudentTemplateId: string
  deleteStudentTemplateId: string
  removeMemberTemplateId: string
  emailWhitelist4Students: string
  inviteTeacherToSchoolTemplateId: string
}

export default registerAs('sendgridConfig', () => {
  return {
    apiKey: process.env.SENDGRID_API_KEY,
    emailFrom: process.env.SENDGRID_EMAIL_FROM,
    nameFrom: process.env.SENDGRID_NAME_FROM,
    inviteTemplateId: process.env.INVITE_TEMPLATE_ID,
    createOrgTemplateId: process.env.CREATE_ORG_TEMPLATE_ID,
    createTenantTemplateId: process.env.CREATE_TENANT_TEMPLATE_ID,
    createStudentTemplateId: process.env.CREATE_STUDENT_TEMPLATE_ID,
    inviteStudentCode: process.env.INVITE_STUDENT_CODE,
    inviteStudentTemplateId: process.env.INVITE_STUDENT_TEMPLATE_ID,
    inviteToStreamTemplateId: process.env.INVITE_TO_STREAM_TEMPLATE_ID,
    inviteTeacherToSchoolTemplateId:
      process.env.INVITE_TEACHER_TO_SCHOOL_TEMPLATE_ID,
    resetPasswordStudentTemplateId:
      process.env.RESET_PASSWORD_STUDENT_TEMPLATE_ID,
    deleteStudentTemplateId: process.env.DELETE_STUDENT_TEMPLATE_ID,
    removeMemberTemplateId: process.env.REMOVE_MEMBER_TEMPLATE_ID,
    emailWhitelist4Students:
      process.env.EMAIL_WHITELIST_FOR_STUDENTS ||
      'gmail.com,outlook.com,microsoft.com,hotmail.com,apple.com,yahoo.com,protonmail.com,proton.me',
  } as SendgridConfig
})
