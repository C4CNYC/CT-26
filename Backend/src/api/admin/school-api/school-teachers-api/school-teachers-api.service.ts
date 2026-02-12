import { Injectable } from '@nestjs/common'

import { User } from '../../../../modules/core/user/user.entity'
import { SchoolMangerService } from '../../../../modules/managers/school-manager/school-manager.service'
import { MessageDto } from '../../../../utils/dtos/message.dto'
import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { AddTeacherDto } from '../dtos/add-teacher.dto'
import { RemoveTeacherDto } from '../dtos/remove-teacher.dto'

@Injectable()
export class SchoolTeachersApiService {
  constructor(private schoolManagerService: SchoolMangerService) {}
  async addTeacher(school_id: string, dto: AddTeacherDto): Promise<MessageDto> {
    return await this.schoolManagerService.addTeacher(school_id, dto)
  }

  async removeTeacher(
    school_id: string,
    dto: RemoveTeacherDto,
  ): Promise<MessageDto> {
    return await this.schoolManagerService.removeTeacher(school_id, dto)
  }

  async getTeachers(
    id: string,
    page_options_dto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.schoolManagerService.getTeachers(id, page_options_dto)
  }
}
