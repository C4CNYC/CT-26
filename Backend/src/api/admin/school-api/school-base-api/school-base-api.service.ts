import { Injectable } from '@nestjs/common'

import { School } from '../../../../modules/core/school/school.entity'
import { SchoolMangerService } from '../../../../modules/managers/school-manager/school-manager.service'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { CreateSchoolDto } from '../dtos/create-school.dto'
import { SchoolOptionDto } from '../dtos/school-option.dto'

@Injectable()
export class SchoolBaseApiService {
  constructor(private schoolManagerService: SchoolMangerService) {}
  async createSchool(dto: CreateSchoolDto, org_id: string): Promise<School> {
    return await this.schoolManagerService.create(dto, org_id)
  }
  async archiveSchool(school_id: string) {
    return await this.schoolManagerService.archiveSchool(school_id)
  }

  async getSchools(
    page_options_dto: SchoolOptionDto,
  ): Promise<PageDto<School>> {
    return await this.schoolManagerService.getSchools(page_options_dto)
  }
}
