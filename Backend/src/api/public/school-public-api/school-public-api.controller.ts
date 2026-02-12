import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

import { School } from '../../../modules/core/school/school.entity'
import { SchoolMangerService } from '../../../modules/managers/school-manager/school-manager.service'

@ApiTags('School API (PUBLIC)')
@ApiHeader({ name: 'x-tenant-id' })
@Controller('school')
export class SchoolPublicApiController {
  constructor(private schoolService: SchoolMangerService) {}
  @Get('/:school_id')
  async getTenant(
    @Param('school_id', new ParseUUIDPipe()) id: string,
  ): Promise<School> {
    return await this.schoolService.getSchool(id)
  }
}
