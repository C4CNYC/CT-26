export enum ApplicationEventEnum {
  INVITE_USER = 'intite.user',
  INVITE_TEACHER_TO_SCHOOL = 'invite.teachertoschool',
  INVITE_TO_STREAM = 'invite.tostream',
  ACCOUNT_REMOVED = 'account.removed',
  REMOVE_FILE = 'remove.file',
  INVITE_STUDENT = 'invite.student',
  CREATE_ORG = 'create.organization',
  CREATE_TENANT = 'create.tenant',
  CREATE_STUDENT = 'create.student',
  RESET_STUDENT_PASSWORD = 'reset.studentpassword',
  SET_UP_SCHOOL = 'setup.school',
  INVITE_STUDENT_CODE = 'invite.studentcode',
  FEEDBACK = 'feedback.user',
}

export type EventHandlerPayloads = {
  CREATE_ORG: { email: string; user_id: string }
}
