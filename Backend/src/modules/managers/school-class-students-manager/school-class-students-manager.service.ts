import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { classroom_v1 } from 'googleapis'

import { AddStudentToClassDto } from '../../../api/manager/school-class-student-manager-api/dtos/add-student-to-class.dto'
import { ApproveStudentPendingDTO } from '../../../api/manager/school-class-student-manager-api/dtos/approve-student-pending.dto'
import { GetGoogleClassesListDto } from '../../../api/manager/school-class-student-manager-api/dtos/get-google-classes-list.dto'
import { MigrateGoogleClassesStudentsDto } from '../../../api/manager/school-class-student-manager-api/dtos/migrate-google-classes-students.dto'
import { RemoveStudentFromClassDto } from '../../../api/manager/school-class-student-manager-api/dtos/remove-student-from-class.dto'
import { GoogleClassesService } from '../../../providers/google-classes/google-classes.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { ClassStudentPendingService } from '../../core/class-student-pending/class-student-pending.service'
import { ClassService } from '../../core/class/class.service'
import { Student } from '../../core/student/student.entity'
import { StudentService } from '../../core/student/student.service'
import { SchoolStudentsManagerService } from '../school-students-manager/school-students-manager.service'

@Injectable()
export class SchoolClassStudentsManagerService {
  private readonly logger = new Logger(SchoolClassStudentsManagerService.name)

  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private classStudentPendingService: ClassStudentPendingService,
    private studentServiceManager: SchoolStudentsManagerService,
    private googleClassesService: GoogleClassesService,
  ) {}

  async getStudentPending(
    class_id: string,
    dto: PageOptionsDto,
  ): Promise<PageDto<Student>> {
    return await this.studentService.getPending(class_id, dto)
  }

  async approveStudentPending(
    class_id: string,
    dto: ApproveStudentPendingDTO,
  ): Promise<MessageDto> {
    const pending = await this.classStudentPendingService.findOne({
      where: {
        class: { id: class_id },
        student: { id: dto.student_id },
      },
      relations: { student: true, class: true },
    })

    if (!pending) {
      throw new BadRequestException('user not invited')
    }

    await this.addStudentToClass(pending.class.id, {
      student_id: pending.student.id,
    })

    await this.classStudentPendingService.remove(pending.id)

    return new MessageDto('student added to class')
  }

  async addStudentToClass(
    class_id: string,
    dto: AddStudentToClassDto,
  ): Promise<void> {
    const schoolClass = await this.classService.findOne({
      where: { id: class_id },
      relations: { students: true },
    })
    if (!schoolClass) throw new NotFoundException(`class doesn't exist`)
    const student = await this.studentServiceManager.getStudent(dto.student_id)
    schoolClass.students.push(student)
    await this.classService.repository.save(schoolClass)
  }

  async removeStudentFromClass(
    class_id: string,
    dto: RemoveStudentFromClassDto,
  ): Promise<void> {
    const schoolClass = await this.classService.findOne({
      where: { id: class_id },
      relations: { students: true, school: true },
    })
    if (!schoolClass) throw new NotFoundException(`class doesn't exist`)

    const student = schoolClass.students.find((s) => s.id === dto.student_id)
    if (!student) return

    schoolClass.students = schoolClass.students.filter(
      (s) => s.id !== dto.student_id,
    )
    await this.classService.repository.save(schoolClass)

    const otherClassesInSameSchool = await this.classService.repository
      .createQueryBuilder('c')
      .innerJoin('c.students', 'student', 'student.id = :student_id', {
        student_id: dto.student_id,
      })
      .innerJoin('c.school', 'school', 'school.id = :school_id', {
        school_id: schoolClass.school.id,
      })
      .getCount()

    if (otherClassesInSameSchool === 0) {
      const studentEntity = await this.studentService.findOne({
        where: { id: dto.student_id },
        relations: { school: true },
      })
      studentEntity.school = studentEntity.school.filter(
        (sch) => sch.id !== schoolClass.school.id,
      )
      await this.studentService.repository.save(studentEntity)
    }
  }

  async getGoogleClassesList(
    class_id: string,
    dto: GetGoogleClassesListDto,
  ): Promise<classroom_v1.Schema$Course[]> {
    const schoolClass = await this.classService.findOne({
      where: { id: class_id },
      relations: { students: true },
    })
    if (!schoolClass) throw new NotFoundException(`class doesn't exist`)
    return await this.googleClassesService.listCourses(dto.access_token)
  }

  async migrateGoogleClassesStudents(
    class_id: string,
    school_id: string,
    tenant: string,
    dto: MigrateGoogleClassesStudentsDto,
  ): Promise<void> {
    try {
      const school_class = await this.classService.findOne({
        where: { id: class_id },
        relations: { students: true },
      })

      if (!school_class) {
        throw new NotFoundException(`Class ${class_id} does not exist`)
      }

      const google_students = await this.googleClassesService.listStudents(
        dto.access_token,
        dto.google_class_id,
      )

      if (!google_students.length) {
        this.logger.warn(
          `No students found in Google Classroom ${dto.google_class_id}`,
        )
        return
      }

      const students =
        await this.studentServiceManager.createStudentsFromGoogleClassesList(
          school_id,
          google_students,
          tenant,
        )

      school_class.students = [...school_class.students, ...students]

      await this.classService.repository.save(school_class)

      this.logger.log(
        `Migrated ${students.length} students from Google Classroom to Class ${class_id}`,
      )
    } catch (error) {
      this.logger.error(
        `Failed to migrate Google Classroom students. classId=${class_id}, schoolId=${school_id}`,
        'migrateGoogleClassesStudents',
      )
      throw error instanceof Error ? error : new InternalServerErrorException()
    }
  }
}
