import { Injectable } from '@nestjs/common'

import { User } from '../../../../modules/core/user/user.entity'
import { SchoolMangerService } from '../../../../modules/managers/school-manager/school-manager.service'
import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../../utils/dtos/page.dto'

@Injectable()
export class SchoolTeachersGetApiService {
  constructor(private schoolManagerService: SchoolMangerService) {}

  async getTeachers(
    id: string,
    page_options_dto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.schoolManagerService.getTeachers(id, page_options_dto)
  }
}
