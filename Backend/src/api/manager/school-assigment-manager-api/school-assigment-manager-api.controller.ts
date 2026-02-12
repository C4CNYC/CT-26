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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Assigment } from '../../../modules/core/assigment/assigment.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { AssignClassDto } from './dtos/assign-class.dto'
import { AssignCourseDto } from './dtos/assign-course.dto'
import { AssignLessonDto } from './dtos/assign-lesson.dto'
import { AssignSkillDto } from './dtos/assign-skill.dto'
import { AssignStudentDto } from './dtos/assign-student.dto'
import { AssignTaskDto } from './dtos/assign-task.dto'
import { CreateAssigmentDto } from './dtos/create-assigment.dto'
import { UnassignSkillDto } from './dtos/unassign-skill.dto'
import { UnassignClassDto } from './dtos/unassigne-class.dto'
import { UnassignStudentDto } from './dtos/unassigne-student.dto'
import { UpdateAssigmentDto } from './dtos/update-assigment.dto'
import { SchoolAssigmentManagerApiService } from './school-assigment-manager-api.service'

@ApiTags('School Assigment API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/school/:school_id/assignment')
export class SchoolAssigmentManagerApiController {
  constructor(
    private schoolAssigmentManagerApiSerice: SchoolAssigmentManagerApiService,
  ) {}
  @Get()
  async getAssigmentList(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
  ): Promise<Assigment[]> {
    return await this.schoolAssigmentManagerApiSerice.getAssigmentList(
      school_id,
    )
  }

  @Get('/:id')
  async getAssigment(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Assigment> {
    return await this.schoolAssigmentManagerApiSerice.getAssigment(id)
  }

  @Post()
  async createAssigment(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Body() dto: CreateAssigmentDto,
  ): Promise<Assigment> {
    return await this.schoolAssigmentManagerApiSerice.createAssigment(
      school_id,
      dto,
    )
  }

  @Patch('/:id')
  async updateAssigment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAssigmentDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.updateAssigment(id, dto)
  }

  @Delete('/:id')
  async removeAssigment(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.removeAssigment(id)
  }

  @Patch('/:id/lesson')
  async assignLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignLessonDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.assignLesson(id, dto)
  }

  @Patch('/:id/task')
  async assignTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignTaskDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.assignTask(id, dto)
  }

  @Patch('/:id/student')
  async assignStudent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignStudentDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.assignStudent(id, dto)
  }

  @Delete('/:id/student')
  async unassigneStudent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UnassignStudentDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.unassigneStudent(id, dto)
  }

  @Patch('/:id/class')
  async assignClass(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignClassDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.assignClass(id, dto)
  }

  @Delete('/:id/class')
  async unassigneClass(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UnassignClassDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.unassigneClass(id, dto)
  }

  @Patch('/:id/course')
  async assignCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignCourseDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.assignCourse(id, dto)
  }

  @Delete('/:id/course')
  async unassigneCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.unassigneCourse(id)
  }

  @Patch('/:id/skill')
  async assignSkill(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignSkillDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.assignSkill(id, dto)
  }

  @Delete('/:id/skill')
  async unassignSkill(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UnassignSkillDto,
  ): Promise<MessageDto> {
    return await this.schoolAssigmentManagerApiSerice.unassignSkill(id, dto)
  }
}
