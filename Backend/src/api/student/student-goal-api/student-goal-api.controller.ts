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
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'

import { StudentGoal } from '../../../modules/core/student-goal/student-goal.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { CreateGoalDto } from './dtos/create-goal.dto'
import { MyGoalSearchOptions } from './dtos/search-goal.dto'
import { UpdateGoalDto } from './dtos/update-goal.dto'
import { StudentGoalApiService } from './student-goal-api.services'

@ApiTags('Goal API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/goal')
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
export class StudenGoalApiController {
  constructor(private studentGoalApiService: StudentGoalApiService) {}

  @Get()
  async getGoalList(
    @Request() request: RequestWithMeta,
    @Query() dot: MyGoalSearchOptions,
  ): Promise<PageDto<StudentGoal>> {
    return await this.studentGoalApiService.getGoalList(
      request.user.studentID,
      dot,
    )
  }

  @Post()
  async createGoal(
    @Request() request: RequestWithMeta,
    @Body() dto: CreateGoalDto,
  ): Promise<StudentGoal> {
    return await this.studentGoalApiService.create(dto, request.user.studentID)
  }

  @Patch(':id')
  async updateGoal(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateGoalDto,
  ): Promise<MessageDto> {
    return await this.studentGoalApiService.update(id, dto)
  }

  @Delete(':id')
  async removeGoal(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.studentGoalApiService.remove(id)
  }
}
