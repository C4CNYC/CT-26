import { Injectable, NotFoundException } from '@nestjs/common'

import { AddMentorToClassDto } from '../../../api/manager/school-class-manager-api/dtos/add-mentor-to-class.dto'
import { RemoveMentorFromClassDto } from '../../../api/manager/school-class-manager-api/dtos/remove-mentor-from-class.dto'
import { ClassService } from '../../core/class/class.service'
import { User } from '../../core/user/user.entity'
import { UserService } from '../../core/user/user.service'

@Injectable()
export class ClassMentorManagerService {
  constructor(
    private classService: ClassService,
    private userService: UserService,
  ) {}

  async getClassMentors(id: string): Promise<User[]> {
    const school_class = await this.classService.findOne({
      where: { id },
      relations: { mentors: true },
    })
    return school_class.mentors
  }

  async addMentorToClass(id: string, dto: AddMentorToClassDto): Promise<void> {
    const unit = await this.classService.findOne({
      where: { id },
      relations: { mentors: true },
    })
    if (!unit) throw new NotFoundException("module doesn't exist")

    const lesson = await this.userService.findOne({
      where: { id: dto.user_id },
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")

    unit.mentors.push(lesson)
    await this.classService.repository.save(unit)
  }

  async removeMentorFromClass(
    id: string,
    dto: RemoveMentorFromClassDto,
  ): Promise<void> {
    const unit = await this.classService.findOne({
      where: { id },
      relations: { mentors: true },
    })
    if (!unit) throw new NotFoundException("module doesn't exist")

    unit.mentors = unit.mentors.filter((m) => m.id !== dto.user_id)
    await this.classService.repository.save(unit)
  }
}
