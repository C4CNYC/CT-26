import { Injectable } from '@nestjs/common'
import { classroom_v1 } from 'googleapis'

import { Student } from '../../../modules/core/student/student.entity'
import { SchoolClassStudentsManagerService } from '../../../modules/managers/school-class-students-manager/school-class-students-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { AddStudentToClassDto } from './dtos/add-student-to-class.dto'
import { ApproveStudentPendingDTO } from './dtos/approve-student-pending.dto'
import { GetGoogleClassesListDto } from './dtos/get-google-classes-list.dto'
import { MigrateGoogleClassesStudentsDto } from './dtos/migrate-google-classes-students.dto'
import { RemoveStudentFromClassDto } from './dtos/remove-student-from-class.dto'

@Injectable()
export class SchoolClassStudentManagerApiService {
  constructor(
    private schoolClassStudentService: SchoolClassStudentsManagerService,
  ) {}

  async approveStudentPending(
    class_id: string,
    dto: ApproveStudentPendingDTO,
  ): Promise<MessageDto> {
    return await this.schoolClassStudentService.approveStudentPending(
      class_id,
      dto,
    )
  }

  async getStudentPending(
    class_id: string,
    dto: PageOptionsDto,
  ): Promise<PageDto<Student>> {
    return await this.schoolClassStudentService.getStudentPending(class_id, dto)
  }

  async getGoogleClassesList(
    class_id: string,
    dto: GetGoogleClassesListDto,
  ): Promise<classroom_v1.Schema$Course[]> {
    return await this.schoolClassStudentService.getGoogleClassesList(
      class_id,
      dto,
    )
  }

  async migrateGoogleClassesStudents(
    class_id: string,
    school_id: string,
    tenant: string,
    dto: MigrateGoogleClassesStudentsDto,
  ): Promise<MessageDto> {
    await this.schoolClassStudentService.migrateGoogleClassesStudents(
      class_id,
      school_id,
      tenant,
      dto,
    )
    return new MessageDto("student's migrated")
  }

  async addStudentToClass(
    class_id: string,
    dto: AddStudentToClassDto,
  ): Promise<MessageDto> {
    await this.schoolClassStudentService.addStudentToClass(class_id, dto)
    return new MessageDto('student joined to class')
  }

  async removeStudentFromClass(
    class_id: string,
    dto: RemoveStudentFromClassDto,
  ): Promise<MessageDto> {
    await this.schoolClassStudentService.removeStudentFromClass(class_id, dto)
    return new MessageDto('student removed from class')
  }
}
