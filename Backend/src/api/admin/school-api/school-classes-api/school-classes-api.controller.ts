import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Class } from '../../../../modules/core/class/class.entity'
import { Role } from '../../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../../utils/dtos/message.dto'
import { RequestWithMeta } from '../../../../utils/interfaces/request-with-meta.interface'
import { UpdateClassDto } from '../../../manager/school-class-manager-api/dtos/update-class.dto'
import { CreateClassDto } from '../dtos/create-class.dto'
import { SchoolClassesApiService } from './school-classes-api.service'

@ApiTags('Classes API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/school')
export class SchoolClassesApiController {
  constructor(private schoolClassesApiService: SchoolClassesApiService) {}
  @Post('/:id/class')
  async createClass(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateClassDto,
    @Request() request: RequestWithMeta,
  ): Promise<Class> {
    return await this.schoolClassesApiService.createClass(
      id,
      request.org_id,
      dto,
    )
  }

  @Get('/:id/class')
  async getClasses(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Class[]> {
    return await this.schoolClassesApiService.getClasses(id)
  }

  @Patch('/:id/class/:class_id')
  async updateClasses(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: UpdateClassDto,
  ): Promise<MessageDto> {
    return await this.schoolClassesApiService.updateClass(class_id, dto)
  }

  @Delete('/:id/class/:class_id')
  async deleteClass(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
  ): Promise<MessageDto> {
    return await this.schoolClassesApiService.deleteClass(class_id)
  }
}
