import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { StudentModulesApiService } from './student-modules-api.services'

@ApiTags('Module API (STUDENT)')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/module')
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
export class StudenModulesApiController {
  constructor(private studentModulesApiService: StudentModulesApiService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getModule(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseUnit> {
    return await this.studentModulesApiService.getModule(
      id,
      request.user.studentID,
    )
  }
  @Get('public/:id')
  async getPublicModule(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseUnit> {
    return await this.studentModulesApiService.getPublicModule(id)
  }
}
