import { Injectable } from '@nestjs/common'
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'

import { InviteSystemService } from '@/modules/core/invite-system/invite-system.service'
import { StudentService } from '@/modules/core/student/student.service'
import { User } from '@/modules/core/user/user.entity'

import { LessonDeepAssignService } from '../lesson-deep-assign/lesson-deep-assign.service'
import { SchoolClassManagerService } from '../school-class-manager/school-class-manager.service'
import { SchoolClassStudentsManagerService } from '../school-class-students-manager/school-class-students-manager.service'

import { SchoolMangerService } from './school-manager.service'

@Injectable()
export class TeacherSchoolSetupService {
  constructor(
    private schoolManager: SchoolMangerService,
    private schoolClassManagerService: SchoolClassManagerService,
    private schoolClassStudentsManagerService: SchoolClassStudentsManagerService,
    private studentService: StudentService,
    private deepAssignService: LessonDeepAssignService,
    private inviteSystemService: InviteSystemService,
  ) {}

  async setupTeacherSchool(user: User, email: string, tenantId: string): Promise<void> {
    const pendingInvite = await this.inviteSystemService.findPendingSchoolInvite(email)

    if (pendingInvite?.schoolId) {
      await this.schoolManager.addTeacher(pendingInvite.schoolId, { user_id: user.id })
      return
    }

    const school = await this.schoolManager.create(
      {
        name: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: ' ',
          style: 'capital',
        }),
        zip: undefined,
        type: undefined,
        city: undefined,
        country: undefined,
      },
      tenantId,
    )

    const schoolClass = await this.schoolClassManagerService.createClass(school.id, {
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      }),
      description: '',
      cover: '',
    })

    await this.schoolManager.addTeacher(school.id, { user_id: user.id })
    const student = await this.studentService.findOne({ where: { account: { id: user.id } } })
    if (student) {
      await this.schoolClassStudentsManagerService.addStudentToClass(schoolClass.id, { student_id: student.id })
    }

    this.deepAssignService.CloneLessonToTeacher(
      {
        user_id: user.id,
        lesson_id: '328ec3d2-a8e6-4503-b288-92895c402085',
      },
      school.id,
    ).catch(() => undefined)
  }
}
