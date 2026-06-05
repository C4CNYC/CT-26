import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { Student } from '../../../modules/core/student/student.entity'
import { StudentService } from '../../../modules/core/student/student.service'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { UserService } from '../../../modules/core/user/user.service'
import { SchoolMangerService } from '../../../modules/managers/school-manager/school-manager.service'
import { SchoolStudentsManagerService } from '../../../modules/managers/school-students-manager/school-students-manager.service'
import { ApplicationEventEnum as Event } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateStudentDto } from './dtos/create-student.dto'
import { InviteStudentDto } from './dtos/invite-student.dto'
import { ResetStudentPasswordDto } from './dtos/reset-student-password.dto'
import { SchoolSearchOptions } from './dtos/school-search-options.dto'
import { UpdateStudentDto } from './dtos/update-student.dto'

import path = require('path')

@Injectable()
export class SchoolStudentManagerApiService {
  constructor(
    private schoolStudentManager: SchoolStudentsManagerService,
    private studentService: StudentService,
    private eventEmitter: EventEmitter2,
    private s3Service: S3Service,
    private schoolManagerService: SchoolMangerService,
    private userService: UserService,
  ) {}

  async inviteStudent(
    school_id: string,
    dto: InviteStudentDto,
    tenant: string,
  ): Promise<MessageDto> {
    await this.schoolStudentManager.inviteStudent(school_id, dto, tenant)
    return new MessageDto('student invited')
  }

  async getStudent(student_id: string): Promise<Student> {
    return await this.schoolStudentManager.getStudent(student_id)
  }

  async getStudents(
    school_id: string,
    dto: SchoolSearchOptions,
  ): Promise<PageDto<Student>> {
    return await this.schoolStudentManager.getStudentsBySchool(school_id, dto)
  }

  async createStudent(
    school_id: string,
    dto: CreateStudentDto,
    tenant_nam: string,
  ): Promise<Student> {
    return await this.schoolStudentManager.createStudent(
      school_id,
      dto,
      tenant_nam,
    )
  }

  async updateStudent(
    student_id: string,
    dto: UpdateStudentDto,
  ): Promise<MessageDto> {
    await this.schoolStudentManager.updateStudent(student_id, dto)
    return new MessageDto('student updated')
  }

  async ResetStudentPassword(
    student_id: string,
    dto: ResetStudentPasswordDto,
  ): Promise<MessageDto> {
    const actionStatus = await this.schoolStudentManager.resetStudentPassword(
      student_id,
      dto.password,
    )
    return new MessageDto(
      actionStatus ? 'student updated' : 'student error occured',
    )
  }

  async updateAvatar(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const student = await this.schoolStudentManager.getStudent(id)
    const old_file_path = `${TENANT_PATH_BUILDER.students(org_id)}/${id}${path.basename(student.avatar || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.students(org_id)}/${id}${path.extname(originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.studentService.update(id, { avatar })
    if (student.avatar) this.eventEmitter.emit(Event.REMOVE_FILE, old_file_path)
    return new MessageDto('avatar udpated')
  }

  async deleteStudent(
    student_id: string,
    tenant_id: string,
  ): Promise<MessageDto> {
    await this.schoolStudentManager.deleteStudent(student_id, tenant_id)
    return new MessageDto('student deleted')
  }

  async promoteToTeacher(school_id: string, student_id: string): Promise<MessageDto> {
    const student = await this.studentService.findOne({
      where: { id: student_id },
      relations: { account: true },
    })
    if (!student?.account) throw new NotFoundException('student not found')

    await this.userService.update(student.account.id, { role: Role.Manager })

    const user = await this.userService.findOne({
      where: { id: student.account.id },
      relations: { schools: true },
    })
    if (!user) throw new NotFoundException('user not found')

    const alreadyTeacher = user.schools.some((s) => s.id === school_id)
    if (!alreadyTeacher) {
      await this.schoolManagerService.addTeacher(school_id, { user_id: student.account.id })
    }
    return new MessageDto('student promoted to teacher')
  }
}
