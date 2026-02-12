import { Injectable } from '@nestjs/common'

import { Assigment } from '../../../modules/core/assigment/assigment.entity'
import { AssigmentManagerService } from '../../../modules/managers/assigment-manager/assigment-manager.service'
import { AssignmentDetailsManagerService } from '../../../modules/managers/assignment-details-manager/assignment-details-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { AssignClassDto } from './dtos/assign-class.dto'
import { AssignCourseDto } from './dtos/assign-course.dto'
import { AssignLessonDto } from './dtos/assign-lesson.dto'
import { AssignSkillDto } from './dtos/assign-skill.dto'
import { AssignStudentDto } from './dtos/assign-student.dto'
import { AssignTaskDto } from './dtos/assign-task.dto'
import { CreateAssigmentDto } from './dtos/create-assigment.dto'
import { UnassignSkillDto } from './dtos/unassign-skill.dto'
import { UnassignClassDto } from './dtos/unassigne-class.dto'
import { UnassignStudentDto } from './dtos/unassigne-student.dto'
import { UpdateAssigmentDto } from './dtos/update-assigment.dto'

@Injectable()
export class SchoolAssigmentManagerApiService {
  constructor(
    private assigmentManagerService: AssigmentManagerService,
    private assignmentDetailsService: AssignmentDetailsManagerService,
  ) {}

  async getAssigmentList(school_id: string): Promise<Assigment[]> {
    return await this.assigmentManagerService.getList(school_id)
  }

  async getAssigment(id: string): Promise<Assigment> {
    return await this.assigmentManagerService.getAssigment(id)
  }

  async createAssigment(
    school_id: string,
    dto: CreateAssigmentDto,
  ): Promise<Assigment> {
    return await this.assigmentManagerService.create(school_id, dto)
  }

  async updateAssigment(
    id: string,
    dto: UpdateAssigmentDto,
  ): Promise<MessageDto> {
    await this.assigmentManagerService.update(id, dto)
    return new MessageDto('assigment udpated')
  }

  async removeAssigment(id: string): Promise<MessageDto> {
    await this.assigmentManagerService.remove(id)
    return new MessageDto('assigment removed')
  }

  async assignLesson(id: string, dto: AssignLessonDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.assignLesson(id, dto)
  }

  async assignTask(id: string, dto: AssignTaskDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.assignTask(id, dto)
  }

  async assignClass(id: string, dto: AssignClassDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.assignClass(id, dto)
  }

  async unassigneClass(id: string, dto: UnassignClassDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.unassigneClass(id, dto)
  }

  async unassigneStudent(
    id: string,
    dto: UnassignStudentDto,
  ): Promise<MessageDto> {
    return await this.assignmentDetailsService.assignStudent(id, dto)
  }

  async assignStudent(id: string, dto: AssignStudentDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.unassignStudent(id, dto)
  }

  async unassigneCourse(id: string): Promise<MessageDto> {
    return await this.assignmentDetailsService.unassignCourse(id)
  }

  async assignCourse(id: string, dto: AssignCourseDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.assignCourse(id, dto)
  }

  async unassignSkill(id: string, dto: UnassignSkillDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.unassignSkill(id, dto)
  }

  async assignSkill(id: string, dto: AssignSkillDto): Promise<MessageDto> {
    return await this.assignmentDetailsService.assignSkill(id, dto)
  }
}
