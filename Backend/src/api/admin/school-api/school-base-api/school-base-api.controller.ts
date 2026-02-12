import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'
import { MessageDto } from '@/utils/dtos/message.dto'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { School } from '../../../../modules/core/school/school.entity'
import { Role } from '../../../../modules/core/user/enums/role.enum'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { CreateSchoolDto } from '../dtos/create-school.dto'
import { SchoolOptionDto } from '../dtos/school-option.dto'
import { SchoolBaseApiService } from './school-base-api.service'

@ApiTags('School API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/school')
export class SchoolBaseApiController {
  constructor(private schoolBaseApiService: SchoolBaseApiService) {}

  @Post()
  async createSchool(
    @Request() request: RequestWithMeta,
    @Body() dto: CreateSchoolDto,
  ): Promise<School> {
    return await this.schoolBaseApiService.createSchool(dto, request.org_id)
  }

  @Get()
  async getSchools(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: SchoolOptionDto,
  ): Promise<PageDto<School>> {
    return await this.schoolBaseApiService.getSchools({
      org_id: request.org_id,
      ...page_options_dto,
    } as SchoolOptionDto)
  }
  @Patch(':id')
  async archiveSchool(@Param('id') id: string): Promise<MessageDto> {
    return await this.schoolBaseApiService.archiveSchool(id)
  }
}
