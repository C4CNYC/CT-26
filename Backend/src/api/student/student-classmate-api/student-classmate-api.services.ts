import { Injectable } from '@nestjs/common'

import { Student } from '../../../modules/core/student/student.entity'
import { StudentManagerService } from '../../../modules/managers/student-manager/student-manager.service'
import { PageDto } from '../../../utils/dtos/page.dto'
import { MyClassmateSearchOptions } from './dtos/my-courses-search-options.dto'

@Injectable()
export class StudentClassmateApiService {
  constructor(private studentManagerService: StudentManagerService) {}

  async getClassmates(
    student_id: string,
    dto: MyClassmateSearchOptions,
  ): Promise<PageDto<Student>> {
    return await this.studentManagerService.getClassmates(student_id, dto)
  }

  async getClassmate(id: string): Promise<Student> {
    return await this.studentManagerService.getStudent(id)
  }
}
