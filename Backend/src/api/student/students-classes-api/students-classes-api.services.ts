import { Injectable } from '@nestjs/common'

import { Class } from '../../../modules/core/class/class.entity'
import { StudentClassesManagerService } from '../../../modules/managers/student-manager/classes-student-manager/classes-student-manager.service'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { StudentJoinClassDto } from '../../admin/school-api/dtos/join-class.dto'
import { MyClassesSearchOptions } from './dtos/my-class-search-options.dto'

@Injectable()
export class StudentClassesApiService {
  constructor(
    private studentClassesManagerService: StudentClassesManagerService,
  ) {}

  async joinClass(
    studentID: string,
    dto: StudentJoinClassDto,
  ): Promise<{ status: string; tribe: Class | null }> {
    return await this.studentClassesManagerService.joinClass(studentID, dto)
  }

  async getClasses(
    student_id: string,
    dto: MyClassesSearchOptions,
  ): Promise<PageDto<Class>> {
    return await this.studentClassesManagerService.getClasses(student_id, dto)
  }

  async getClass(
    user: RequestWithMeta['user'],
    class_id: string,
  ): Promise<Class> {
    return await this.studentClassesManagerService.getClass(user, class_id)
  }

  async getClassProgress(user: RequestWithMeta['user'], class_id: string) {
    return await this.studentClassesManagerService.getClassProgress(
      user,
      class_id,
    )
  }
}
