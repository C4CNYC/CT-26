import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateStudentDto } from '../../../api/manager/school-student-manager-api/dtos/create-student.dto'
import { MyClassmateSearchOptions } from '../../../api/student/student-classmate-api/dtos/my-courses-search-options.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Student } from '../../core/student/student.entity'
import { StudentService } from '../../core/student/student.service'

@Injectable()
export class StudentManagerService {
  constructor(private studentService: StudentService) {}

  async getStudent(id: string): Promise<Student> {
    const student = await this.studentService.findOne({
      where: { id },
      relations: { account: true },
    })
    if (!student) throw new NotFoundException("student doesn't exist")
    return student
  }

  async getClassmates(
    id: string,
    dto: MyClassmateSearchOptions,
  ): Promise<PageDto<Student>> {
    return await this.studentService.getClassmates(id, dto)
  }

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    return await this.studentService.create({
      ...dto,
      active: true,
      username: dto.email,
    })
  }
}
