import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Role } from '../../../../modules/core/user/enums/role.enum'
import { Roles } from '../../../../old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../../../../old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../../../../old-auth/guards/role-auth.guard'
import { MessageDto } from '../../../../utils/dtos/message.dto'
import { AddTeacherDto } from '../dtos/add-teacher.dto'
import { SchoolTeachersApiService } from './school-teachers-api.service'

@ApiTags('Teacher API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/school')
export class SchoolTeachersApiController {
  constructor(private schoolTeacherApiService: SchoolTeachersApiService) {}
  @Post(':id/teacher')
  async addTeacher(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddTeacherDto,
  ): Promise<MessageDto> {
    return await this.schoolTeacherApiService.addTeacher(id, dto)
  }

  @Delete(':id/teacher')
  async removeTeacher(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddTeacherDto,
  ): Promise<MessageDto> {
    return await this.schoolTeacherApiService.removeTeacher(id, dto)
  }
}
