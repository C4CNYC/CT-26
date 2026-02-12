import { Injectable } from '@nestjs/common'

import { Assigment } from '../../../modules/core/assigment/assigment.entity'
import { StudentAssignmentManagerService } from '../../../modules/managers/student-manager/assignment-student-manager/assignment-student-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { MyAssignmentsSearchOptions } from './dtos/my-assignment-search-options.dto'

@Injectable()
export class StudentAssignmentsApiService {
  constructor(
    private studentAssignmentsManagerService: StudentAssignmentManagerService,
  ) {}

  async unpingAssignment(
    student_id: string,
    assignment_id: string,
  ): Promise<MessageDto> {
    return await this.studentAssignmentsManagerService.unpingAssignment(
      student_id,
      assignment_id,
    )
  }
  async pingAssignment(
    student_id: string,
    assignment_id: string,
  ): Promise<MessageDto> {
    return await this.studentAssignmentsManagerService.pingAssignment(
      student_id,
      assignment_id,
    )
  }

  async getAssignments(
    student_id: string,
    dto: MyAssignmentsSearchOptions,
  ): Promise<PageDto<Assigment>> {
    return await this.studentAssignmentsManagerService.getAssignments(
      student_id,
      dto,
    )
  }

  async getAssignmentsPublic(
    dto: MyAssignmentsSearchOptions,
  ): Promise<PageDto<Assigment>> {
    return await this.studentAssignmentsManagerService.getAssignmentsPublic(dto)
  }

  async getAssignment(
    student_id: string,
    assignment_id: string,
  ): Promise<Assigment> {
    return await this.studentAssignmentsManagerService.getAssignment(
      student_id,
      assignment_id,
    )
  }

  async getAssignmentPublic(assignment_id: string): Promise<Assigment> {
    return await this.studentAssignmentsManagerService.getAssignmentPublic(
      assignment_id,
    )
  }
}
