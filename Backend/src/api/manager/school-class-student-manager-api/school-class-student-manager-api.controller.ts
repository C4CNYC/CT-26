import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'
import { classroom_v1 } from 'googleapis'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Student } from '../../../modules/core/student/student.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { AddStudentToClassDto } from './dtos/add-student-to-class.dto'
import { ApproveStudentPendingDTO } from './dtos/approve-student-pending.dto'
import { GetGoogleClassesListDto } from './dtos/get-google-classes-list.dto'
import { MigrateGoogleClassesStudentsDto } from './dtos/migrate-google-classes-students.dto'
import { RemoveStudentFromClassDto } from './dtos/remove-student-from-class.dto'
import { SchoolClassStudentManagerApiService } from './school-class-student-manager-api.service'

@ApiTags('School Class Students API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/school/:school_id/class/:id')
export class SchoolClassStudentManagerApiController {
  constructor(
    private schoolClassStudentService: SchoolClassStudentManagerApiService,
  ) {}

  @Get('/student/pending')
  async getStudentPending(
    @Param('id', new ParseUUIDPipe()) class_id: string,
    @Query() dto: PageOptionsDto,
  ): Promise<PageDto<Student>> {
    return await this.schoolClassStudentService.getStudentPending(class_id, dto)
  }

  @Post('/student/pending')
  async approveStudentPending(
    @Param('id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: ApproveStudentPendingDTO,
  ): Promise<MessageDto> {
    return await this.schoolClassStudentService.approveStudentPending(
      class_id,
      dto,
    )
  }

  @Post('/student')
  async addStudentToClass(
    @Param('id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: AddStudentToClassDto,
  ): Promise<MessageDto> {
    return await this.schoolClassStudentService.addStudentToClass(class_id, dto)
  }

  @Post('/student/google-classes')
  async getGoogleClassesList(
    @Param('id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: GetGoogleClassesListDto,
  ): Promise<classroom_v1.Schema$Course[]> {
    return await this.schoolClassStudentService.getGoogleClassesList(
      class_id,
      dto,
    )
  }

  @Post('/student/migrate/google-classes')
  async addGoogleClassesStudentToClass(
    @Param('id', new ParseUUIDPipe()) class_id: string,
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Req() request: RequestWithMeta,
    @Body() dto: MigrateGoogleClassesStudentsDto,
  ): Promise<MessageDto> {
    return await this.schoolClassStudentService.migrateGoogleClassesStudents(
      class_id,
      school_id,
      request.org_id,
      dto,
    )
  }

  @Delete('/student')
  async removeStudentFromClass(
    @Param('id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: RemoveStudentFromClassDto,
  ): Promise<MessageDto> {
    return await this.schoolClassStudentService.removeStudentFromClass(
      class_id,
      dto,
    )
  }
}
