import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'

import { Class } from '../../../modules/core/class/class.entity'
import { Student } from '../../../modules/core/student/student.entity'
import { StudentService } from '../../../modules/core/student/student.service'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { User } from '../../../modules/core/user/user.entity'
import { ClassMentorManagerService } from '../../../modules/managers/class-mentor-manager/class-mentor-manager.service'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { StudentJoinClassDto } from '../../admin/school-api/dtos/join-class.dto'
import { MyClassesSearchOptions } from './dtos/my-class-search-options.dto'
import { StudentClassesApiService } from './students-classes-api.services'

@ApiTags('Class API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/class')
export class StudentClassesApiController {
  constructor(
    private studentService: StudentService,
    private studentClasssesApiService: StudentClassesApiService,
    private classMentorManagerService: ClassMentorManagerService,
  ) {}

  @Get()
  async getClasses(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: MyClassesSearchOptions,
  ): Promise<PageDto<Class>> {
    return await this.studentClasssesApiService.getClasses(
      request.user?.studentID,
      page_options_dto,
    )
  }

  @Get('/:class_id')
  async getClass(
    @Request() request: RequestWithMeta,
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
  ): Promise<Class> {
    return await this.studentClasssesApiService.getClass(
      request.user?.studentID,
      class_id,
    )
  }

  @Get('/:class_id/progress')
  async getClassProgress(
    @Request() request: RequestWithMeta,
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
  ) {
    return await this.studentClasssesApiService.getClassProgress(
      request.user?.studentID,
      class_id,
    )
  }

  @Get('/:class_id/students')
  async getClassStudents(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Query() page_options_dto: PageOptionsDto,
  ): Promise<PageDto<Student>> {
    return await this.studentService.getByClass(class_id, page_options_dto)
  }

  @Get('/:class_id/mentor')
  async getClassMentors(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
  ): Promise<User[]> {
    return await this.classMentorManagerService.getClassMentors(class_id)
  }

  @Post('/join')
  async joinClass(
    @Request() request: RequestWithMeta,
    @Body() dto: StudentJoinClassDto,
  ): Promise<{ status: string; tribe: Class | null }> {
    return await this.studentClasssesApiService.joinClass(
      request.user?.studentID,
      dto,
    )
  }
}
