import { Injectable } from '@nestjs/common'

import { StudentGoal } from '../../../modules/core/student-goal/student-goal.entity'
import { StudentGoalService } from '../../../modules/core/student-goal/student-goal.service'
import { StudentService } from '../../../modules/core/student/student.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateGoalDto } from './dtos/create-goal.dto'
import { MyGoalSearchOptions } from './dtos/search-goal.dto'
import { UpdateGoalDto } from './dtos/update-goal.dto'

@Injectable()
export class StudentGoalApiService {
  constructor(
    private studentGoalService: StudentGoalService,
    private studentService: StudentService,
  ) {}

  async getGoalList(
    student_id: string,
    dto: MyGoalSearchOptions,
  ): Promise<PageDto<StudentGoal>> {
    return await this.studentGoalService.getByStudent(student_id, dto)
  }

  async create(dto: CreateGoalDto, student_id: string): Promise<StudentGoal> {
    const student = await this.studentService.findOne({
      where: { id: student_id },
      relations: { goals: true },
    })
    const goal = await this.studentGoalService.create({ ...dto })
    student.goals.push(goal)
    await this.studentService.repository.save(student)
    return goal
  }

  async update(id: string, dto: UpdateGoalDto): Promise<MessageDto> {
    await this.studentGoalService.update(id, dto)
    return new MessageDto('Goal updated')
  }

  async remove(id: string): Promise<MessageDto> {
    await this.studentGoalService.remove(id)
    return new MessageDto('Goal removed')
  }
}
