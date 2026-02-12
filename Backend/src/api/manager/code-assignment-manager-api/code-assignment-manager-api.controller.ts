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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { CodeAssignment } from '../../../modules/core/code-assignment/code-assignment.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CodeAssignmentManagerApiService } from './code-assignment-manager-api.service'
import { CodeAssignmentSearchOptions } from './dtos/code-assignment-search-option.dto'
import { CreateCodeAssignmentDto } from './dtos/create-code-assignment.dto'
import { UpdateCodeAssignmentDto } from './dtos/update-code-assignment.dto'

@ApiTags('Task API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/task')
export class CodeAssignmentManagerApiController {
  constructor(
    private codeAssignmentManagerApiService: CodeAssignmentManagerApiService,
  ) {}
  @Get()
  async getCodeAssignmentList(
    @Query() dto: CodeAssignmentSearchOptions,
  ): Promise<PageDto<CodeAssignment>> {
    return await this.codeAssignmentManagerApiService.getCodeAssignmentList(dto)
  }

  @Get('/:id')
  async getCodeAssignment(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CodeAssignment> {
    return await this.codeAssignmentManagerApiService.getCodeAssignment(id)
  }

  @Post()
  async createCodeAssignment(
    @Body() dto: CreateCodeAssignmentDto,
  ): Promise<CodeAssignment> {
    return await this.codeAssignmentManagerApiService.createCodeAssignment(dto)
  }

  @Patch('/:id')
  async updateCodeAssignment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCodeAssignmentDto,
  ): Promise<MessageDto> {
    return await this.codeAssignmentManagerApiService.updateCodeAssignment(
      id,
      dto,
    )
  }

  @Delete('/:id')
  async removeCodeAssignment(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.codeAssignmentManagerApiService.removeCodeAssignment(id)
  }
}
