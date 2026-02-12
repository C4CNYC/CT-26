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

import { StudentLessonFile } from '@/modules/core/student-lesson-file/student-lesson-file.entity'
import { WorkspaceManagerService } from '@/modules/managers/workspace-manager/workspace-manager.service'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { MessageDto } from '@/utils/dtos/message.dto'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { Role } from '../../../modules/core/user/enums/role.enum'
import { CarryOverFilesDto } from './dtos/carry-over-files.dto'
import { CreateFileDto } from './dtos/create-file.dto'
import { CreateThreadDto } from './dtos/create-thread.dto'
import { GetFilesDto } from './dtos/get-files.dto'
import { UpdateFileDto } from './dtos/update-file.dto'

@ApiTags('Workspace API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/workspace')
export class StudentWorkspaceApiController {
  constructor(private workspaceManagerService: WorkspaceManagerService) {}

  @Get()
  async getFiles(
    @Request() request: RequestWithMeta,
    @Query() dto: GetFilesDto,
  ): Promise<StudentLessonFile[]> {
    return await this.workspaceManagerService.getFiles(
      request.user.studentID,
      dto.lessonContentId,
      dto.lessonId,
    )
  }

  @Post('file/carry-over')
  async carryOverFiles(
    @Request() request: RequestWithMeta,
    @Body() dto: CarryOverFilesDto,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.carryOverLessonFiles(
      request.user.studentID,
      dto.lessonId,
      dto.prevLessonId,
    )
  }

  @Post('file')
  async createFile(
    @Request() request: RequestWithMeta,
    @Body() dto: CreateFileDto,
  ): Promise<StudentLessonFile> {
    return await this.workspaceManagerService.createFile(
      request.user.studentID,
      dto.lessonId,
      dto.name,
      dto.body,
      dto.extension,
      dto.lessonContentId,
    )
  }

  @Post('file/:id/thread')
  async createThread(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateThreadDto,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.createThread(
      request.user.studentID,
      id,
      dto.message,
    )
  }

  @Post('file/:id/thread/:threadId/discussion')
  async createThreadDiscussion(
    @Request() request: RequestWithMeta,
    @Param('threadId', new ParseUUIDPipe()) threadId: string,
    @Body() dto: CreateThreadDto,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.createThreadDiscussion(
      request.user.studentID,
      threadId,
      dto.message,
    )
  }

  @Post('file/:id/thread/:threadId/discussion/:discussionId/reaction')
  async createThreadDiscussionReaction(
    @Request() request: RequestWithMeta,
    @Param('discussionId', new ParseUUIDPipe()) discussionId: string,
    @Body() dto: CreateThreadDto,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.createThreadDiscussionReaction(
      request.user.studentID,
      discussionId,
      dto.message,
    )
  }

  @Patch('file/:id/thread/:threadId/discussion/:discussionId')
  async updateThreadDiscussion(
    @Param('discussionId', new ParseUUIDPipe()) discussionId: string,
    @Body() dto: CreateThreadDto,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.updateThreadDiscussion(
      discussionId,
      dto.message,
    )
  }

  @Patch('file/:id/thread/:threadId')
  async updateThread(
    @Param('threadId', new ParseUUIDPipe()) threadId: string,
    @Body() dto: CreateThreadDto,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.updateThread(
      threadId,
      dto.message,
    )
  }

  @Patch('file/:id')
  async updateFile(
    @Body() dto: UpdateFileDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.updateFile(
      id,
      dto.name,
      dto.body,
      dto.extension,
    )
  }

  @Delete('file/:id')
  async deleteFile(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.deleteFile(id)
  }

  @Delete('file/:id/thread/:threadId')
  async deleteThread(
    @Param('threadId', new ParseUUIDPipe()) threadId: string,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.deleteThread(threadId)
  }

  @Delete('file/:id/thread/:threadId/discussion/:discussionId')
  async deleteThreadDiscussion(
    @Param('discussionId', new ParseUUIDPipe()) discussionId: string,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.deleteThreadDiscussion(
      discussionId,
    )
  }

  @Post(
    'file/:id/thread/:threadId/discussion/:discussionId/reaction/:reactionId',
  )
  async deleteThreadDiscussionReaction(
    @Param('reactionId', new ParseUUIDPipe()) reactionId: string,
  ): Promise<MessageDto> {
    return await this.workspaceManagerService.deleteThreadDiscussionReaction(
      reactionId,
    )
  }
}
