import { ForbiddenException, Injectable } from '@nestjs/common'

import { MyAssignmentsSearchOptions } from '../../../../api/student/student-assignments-api/dtos/my-assignment-search-options.dto'
import { MessageDto } from '../../../../utils/dtos/message.dto'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { Assigment } from '../../../core/assigment/assigment.entity'
import { AssigmentService } from '../../../core/assigment/assigment.service'
import { StudentService } from '../../../core/student/student.service'
import { Role } from '../../../core/user/enums/role.enum'
import { UserService } from '../../../core/user/user.service'
import { StudentClassesManagerService } from '../classes-student-manager/classes-student-manager.service'

@Injectable()
export class StudentAssignmentManagerService {
  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private assignmentService: AssigmentService,
    private classManagerService: StudentClassesManagerService,
  ) {}

  async pingAssignment(
    student_id: string,
    assignment_id: string,
  ): Promise<MessageDto> {
    const student = await this.studentService.findOne({
      where: { id: student_id },
      relations: {
        pined_assignment: true,
      },
    })
    const assignment = await this.assignmentService.findOne({
      where: { id: assignment_id },
    })
    student.pined_assignment.push(assignment)
    await this.studentService.repository.save(student)

    return new MessageDto('pined')
  }

  async unpingAssignment(
    student_id: string,
    assignment_id: string,
  ): Promise<MessageDto> {
    const student = await this.studentService.findOne({
      where: { id: student_id },
      relations: {
        pined_assignment: true,
      },
    })

    student.pined_assignment = student.pined_assignment.filter(
      (a) => a.id !== assignment_id,
    )
    await this.studentService.repository.save(student)
    return new MessageDto('unpined')
  }

  async checkClassPermission(
    student_id: string,
    assignment_id: string,
  ): Promise<boolean> {
    return await this.assignmentService.checkStudentAccess(
      student_id,
      assignment_id,
    )
  }

  async getAssignments(
    student_id: string,
    dto: MyAssignmentsSearchOptions,
  ): Promise<PageDto<Assigment>> {
    const user = await this.userService.findOne({
      where: {
        id: student_id,
      },
    })
    const permission = await this.classManagerService.checkClassPermission(
      student_id,
      dto.class_id,
    )

    if (!user) {
      throw new ForbiddenException('No such user')
    }

    if (!permission && user.role === Role.Student) {
      throw new ForbiddenException("you don't have access to class")
    }

    return await this.assignmentService.getByClass(student_id, dto)
  }

  async getAssignmentsPublic(dto: MyAssignmentsSearchOptions) {
    return await this.assignmentService.getByClassPublic(dto)
  }

  async getAssignment(
    student_id: string,
    assignment_id: string,
  ): Promise<Assigment> {
    const permission = await this.checkClassPermission(
      student_id,
      assignment_id,
    )

    if (!permission) throw new ForbiddenException('studen not member of class')
    return await this.assignmentService.findOne({
      where: { id: assignment_id },
      relations: {
        course: true,
        courseUnit: true,
        skill_tags: true,
      },
    })
  }

  async getAssignmentPublic(assignment_id: string): Promise<Assigment> {
    return await this.assignmentService.findOne({
      where: { id: assignment_id },
      relations: {
        course: true,
        courseUnit: true,
        skill_tags: true,
      },
    })
  }
}
