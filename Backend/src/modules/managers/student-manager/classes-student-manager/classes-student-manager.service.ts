import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { PageOptionsDto } from '@/utils/dtos/page-option.dto'

import { StudentJoinClassDto } from '../../../../api/admin/school-api/dtos/join-class.dto'
import { MyClassesSearchOptions } from '../../../../api/student/students-classes-api/dtos/my-class-search-options.dto'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { ClassStudentPendingService } from '../../../core/class-student-pending/class-student-pending.service'
import { Class } from '../../../core/class/class.entity'
import { ClassService } from '../../../core/class/class.service'
import { StudentService } from '../../../core/student/student.service'

@Injectable()
export class StudentClassesManagerService {
  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private classStudentPendingService: ClassStudentPendingService,
  ) {}

  async checkClassPermission(
    student_id: string,
    class_id: string,
  ): Promise<boolean> {
    const students = await this.studentService.getByClass(
      class_id,
      {} as PageOptionsDto,
    )
    const studentPermission = students?.data?.find(
      (student) =>
        student?.account?.id === student_id || student?.id === student_id,
    )
    if (studentPermission) return true

    return false
  }

  async getClasses(
    student_id: string,
    dto: MyClassesSearchOptions,
  ): Promise<PageDto<Class>> {
    return await this.classService.getByStudent(student_id, dto)
  }

  async getClass(student_id: string, class_id: string): Promise<Class> {
    const permission = await this.checkClassPermission(student_id, class_id)
    if (!permission) throw new ForbiddenException('studen not member of class')
    const schoolClass = await this.classService.getClass(class_id)
    return schoolClass
  }

  async getClassProgress(student_id: string, class_id: string) {
    const permission = await this.checkClassPermission(student_id, class_id)
    if (!permission) throw new ForbiddenException('student not member of class')
    const classProgress = await this.classService.getClassProgress(class_id)

    return classProgress
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
