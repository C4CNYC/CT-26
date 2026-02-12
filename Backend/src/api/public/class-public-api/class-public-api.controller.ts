import { Controller, Get, Param } from '@nestjs/common'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

import { Class } from '../../../modules/core/class/class.entity'
import { SchoolClassManagerService } from '../../../modules/managers/school-class-manager/school-class-manager.service'

@ApiTags('CLASS API (PUBLIC)')
@ApiHeader({ name: 'x-tenant-id' })
@Controller('class')
export class ClassPublicApiController {
  constructor(private classService: SchoolClassManagerService) {}
  @Get('/:join_code')
  async getClassByShareToken(
    @Param('join_code') join_code: string,
  ): Promise<Class> {
    return await this.classService.getClassByShareToken(join_code)
  }
}
