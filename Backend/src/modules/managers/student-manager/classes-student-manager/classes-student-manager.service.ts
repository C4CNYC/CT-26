import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { StudentJoinClassDto } from '../../../../api/admin/school-api/dtos/join-class.dto'
import { MyClassesSearchOptions } from '../../../../api/student/students-classes-api/dtos/my-class-search-options.dto'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { ClassStudentPendingService } from '../../../core/class-student-pending/class-student-pending.service'
import { Class } from '../../../core/class/class.entity'
import { ClassService } from '../../../core/class/class.service'
import { StudentService } from '../../../core/student/student.service'
import { SchoolAccessManagerService } from '../../school-access-manager/school-access-manager.service'

type ClassViewer = Pick<RequestWithMeta['user'], 'id' | 'studentID'>

@Injectable()
export class StudentClassesManagerService {
  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private classStudentPendingService: ClassStudentPendingService,
    private schoolAccessManagerService: SchoolAccessManagerService,
  ) {}

  async canUserViewClass(
    user: ClassViewer,
    class_id: string,
  ): Promise<boolean> {
    if (!user.id || !class_id) return false
    if (user.studentID) {
      const class_of_student = await this.classService.findOne({
        where: { id: class_id, students: { id: user.studentID } },
      })
      if (class_of_student) return true
    }
    const class_of_mentor = await this.classService.findOne({
      where: { id: class_id, mentors: { id: user.id } },
    })
    if (class_of_mentor) return true
    const school_class = await this.classService.findOne({
      where: { id: class_id },
      relations: { school: true },
    })
    if (!school_class?.school) return false
    return await this.schoolAccessManagerService.canUserManageSchool(
      user.id,
      school_class.school.id,
    )
  }

  private async ensureUserCanViewClass(
    user: ClassViewer,
    class_id: string,
  ): Promise<void> {
    if (!(await this.canUserViewClass(user, class_id))) {
      throw new ForbiddenException('not a member of this class')
    }
  }

  async getClasses(
    student_id: string,
    dto: MyClassesSearchOptions,
  ): Promise<PageDto<Class>> {
    return await this.classService.getByStudent(student_id, dto)
  }

  async getClass(user: ClassViewer, class_id: string): Promise<Class> {
    await this.ensureUserCanViewClass(user, class_id)
    return await this.classService.getClass(class_id)
  }

  async getClassProgress(user: ClassViewer, class_id: string) {
    await this.ensureUserCanViewClass(user, class_id)
    return await this.classService.getClassProgress(class_id)
  }

  async joinClass(
    studentID: string,
    dto: StudentJoinClassDto,
  ): Promise<{ status: string; tribe: Class | null }> {
    const schoolClass = await this.classService.findOne({
      where: {
        setting: { share_token: dto.share_token },
      },
      relations: {
        setting: true,
        students: true,
        school: true,
      },
    })

    if (!schoolClass || schoolClass.setting.share_token !== dto.share_token) {
      throw new ForbiddenException('wrong data')
    }

    const student = await this.studentService.findOne({
      where: { id: studentID },
      relations: { school: true },
    })

    const isStudentInClass = schoolClass.students.some(
      (s) => s.id === student.id,
    )
    if (isStudentInClass) {
      throw new ConflictException('student already in class')
    }

    const alreadyInSchool = student.school?.some(
      (sch) => sch.id === schoolClass.school.id,
    )
    if (!alreadyInSchool) {
      student.school = [...(student.school || []), schoolClass.school]
      await this.studentService.repository.save(student)
    }

    if (!schoolClass.setting.request_join_enable) {
      await this.classStudentPendingService.create({
        student,
        class: schoolClass,
      })

      return {
        status: 'pending',
        tribe: null,
      }
    }

    schoolClass.students.push(student)
    await this.classService.repository.save(schoolClass)

    return {
      status: 'joined',
      tribe: schoolClass,
    }
  }
}
