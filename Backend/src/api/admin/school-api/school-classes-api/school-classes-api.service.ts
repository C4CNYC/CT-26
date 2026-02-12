import { Injectable, NotFoundException } from '@nestjs/common'

import { Class } from '../../../../modules/core/class/class.entity'
import { ClassService } from '../../../../modules/core/class/class.service'
import { SchoolService } from '../../../../modules/core/school/school.service'
import { SchoolMangerService } from '../../../../modules/managers/school-manager/school-manager.service'
import { MessageDto } from '../../../../utils/dtos/message.dto'
import { UpdateClassDto } from '../../../manager/school-class-manager-api/dtos/update-class.dto'
import { CreateClassDto } from '../dtos/create-class.dto'

@Injectable()
export class SchoolClassesApiService {
  constructor(
    private schoolService: SchoolService,
    private schoolManagerService: SchoolMangerService,
    private classService: ClassService,
  ) {}
  async createClass(
    id: string,
    org_id: string,
    dto: CreateClassDto,
  ): Promise<Class> {
    const school = await this.schoolService.findOne({
      where: { id },
    })
    if (!school) throw new NotFoundException(`school doesn't exis`)
    return await this.schoolManagerService.createClass(dto, school)
  }

  async getClasses(school_id: string): Promise<Class[]> {
    return await this.classService.find({
      school: {
        id: school_id,
      },
    })
  }

  async updateClass(
    class_id: string,
    dto: UpdateClassDto,
  ): Promise<MessageDto> {
    await this.classService.update(class_id, dto)
    return new MessageDto('class updated')
  }

  async deleteClass(id: string): Promise<MessageDto> {
    await this.classService.remove(id)
    return new MessageDto('class removed')
  }
}
