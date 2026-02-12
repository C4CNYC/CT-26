import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Role } from '../../../../modules/core/user/enums/role.enum'
import { User } from '../../../../modules/core/user/user.entity'
import { Roles } from '../../../../old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../../../../old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../../old-auth/guards/role-auth.guard'
import { PageOptionsDto } from '../../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { SchoolTeachersGetApiService } from './school-teachers-get-api.service'

@ApiTags('Teacher API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/school')
export class SchoolTeachersGetApiController {
  constructor(private schoolTeacherApiService: SchoolTeachersGetApiService) {}

  @Get(':id/teacher')
  async getTeachers(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() page_options_dto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.schoolTeacherApiService.getTeachers(id, page_options_dto)
  }
}
