import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'

import { Assigment } from '../../../modules/core/assigment/assigment.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { MyAssignmentsSearchOptions } from './dtos/my-assignment-search-options.dto'
import { StudentAssignmentsApiService } from './students-assignments-api.services'

@ApiTags('Assignments API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/assignment')
@Roles(
  Role.SuperAdmin,
  Role.Admin,
  Role.Owner,
  Role.Manager,
  Role.Editor,
  Role.Student,
)
export class StudentAssignmentsApiController {
  constructor(
    private studentAssignmentsApiService: StudentAssignmentsApiService,
  ) {}

  @Get()
  @ApiQuery({ name: 'class_id', type: 'string' })
  async getAssignments(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: MyAssignmentsSearchOptions,
  ): Promise<PageDto<Assigment>> {
    return await this.studentAssignmentsApiService.getAssignments(
      request.user.id,
      page_options_dto,
    )
  }

  @Patch('/:assignment_id/pin')
  @UseGuards(JwtAuthGuard)
  async pinAssignment(
    @Request() request: RequestWithMeta,
    @Param('assignment_id', new ParseUUIDPipe()) assignment_id: string,
  ): Promise<MessageDto> {
    return await this.studentAssignmentsApiService.pingAssignment(
      request.user?.studentID,
      assignment_id,
    )
  }

  @Patch('/:assignment_id/unpin')
  @UseGuards(JwtAuthGuard)
  async unpinAssignment(
    @Request() request: RequestWithMeta,
    @Param('assignment_id', new ParseUUIDPipe()) assignment_id: string,
  ): Promise<MessageDto> {
    return await this.studentAssignmentsApiService.unpingAssignment(
      request.user.studentID,
      assignment_id,
    )
  }

  @Get('/:assignment_id')
  async getAssignment(
    @Request() request: RequestWithMeta,
    @Param('assignment_id', new ParseUUIDPipe()) assignment_id: string,
  ): Promise<Assigment> {
    return await this.studentAssignmentsApiService.getAssignment(
      request.user?.studentID,
      assignment_id,
    )
  }
}
