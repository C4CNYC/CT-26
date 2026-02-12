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

import { LessonContentFile } from '@/modules/core/lesson-content-file/lesson-content-file.entity'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { LessonContent } from '../../../modules/core/lesson-content/lesson-content.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { AddContentEnvironmentDto } from './dtos/add-content-environment.dto'
import { CreateContentLessonFileDto } from './dtos/create-content-lesson-file.dto'
import { CreateLessonContentDto } from './dtos/create-content-lesson.dto'
import { UpdateContentEnvironmentOrderDto } from './dtos/update-content-environment-order.dto'
import { UpdateContentLessonFileDto } from './dtos/update-content-lesson-file.dto'
import { UpdateLessonContentDto } from './dtos/update-content-lesson.dto'
import { LessonContentManagerApiService } from './lesson-content-manager-api.service'

@ApiTags('Lesson Content API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/lesson/:lesson_id/content')
export class LessonContentManagerApiController {
  constructor(
    private lessonContentManagerApiService: LessonContentManagerApiService,
  ) {}

  @Post()
  async createLessonContent(
    @Param('lesson_id', new ParseUUIDPipe()) lesson_id: string,
    @Body() dto: CreateLessonContentDto,
  ): Promise<LessonContent> {
    return await this.lessonContentManagerApiService.createLessonContent(
      lesson_id,
      dto,
    )
  }

  @Get()
  async getLessonContent(
    @Param('lesson_id', new ParseUUIDPipe()) lesson_id: string,
  ): Promise<LessonContent[]> {
    return await this.lessonContentManagerApiService.getLessonContent(lesson_id)
  }
  @Get('/files')
  async getLessonFiles(
    @Param('lesson_id', new ParseUUIDPipe()) lesson_id: string,
  ): Promise<LessonContentFile[]> {
    return await this.lessonContentManagerApiService.getLessonFiles(lesson_id)
  }

  @Get('/:content_id')
  async getLessonContentById(
    @Param('content_id', new ParseUUIDPipe()) id: string,
  ): Promise<LessonContent> {
    return await this.lessonContentManagerApiService.getLessonContentById(id)
  }

  @Get('/:content_id/file')
  async getLessonContentFiles(
    @Param('content_id', new ParseUUIDPipe()) id: string,
  ): Promise<LessonContentFile[]> {
    return await this.lessonContentManagerApiService.getLessonContentFiles(id)
  }

  @Patch('/:content_id')
  async updateLessonContent(
    @Param('lesson_id', new ParseUUIDPipe()) lesson_id: string,
    @Param('content_id', new ParseUUIDPipe()) content_id: string,
    @Body() dto: UpdateLessonContentDto,
  ): Promise<MessageDto> {
    const result =
      await this.lessonContentManagerApiService.updateLessonContent(
        lesson_id,
        content_id,
        dto,
      )
    return result
  }

  @Post('/:content_id/file')
  async addLessonContentFile(
    @Param('content_id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateContentLessonFileDto,
  ): Promise<LessonContentFile> {
    return await this.lessonContentManagerApiService.addLessonContentFile(
      id,
      dto,
    )
  }

  @Patch('/:content_id/file/:file_id')
  async updateLessonContentFile(
    @Param('content_id', new ParseUUIDPipe()) content_id: string,
    @Param('file_id', new ParseUUIDPipe()) file_id: string,
    @Body() dto: UpdateContentLessonFileDto,
  ): Promise<MessageDto> {
    return await this.lessonContentManagerApiService.updateLessonContentFile(
      content_id,
      file_id,
      dto,
    )
  }

  @Delete('/:content_id/file/:file_id')
  async removeLessonContentFile(
    @Param('content_id', new ParseUUIDPipe()) content_id: string,
    @Param('file_id', new ParseUUIDPipe()) file_id: string,
  ): Promise<MessageDto> {
    return await this.lessonContentManagerApiService.removeLessonContentFile(
      content_id,
      file_id,
    )
  }

  @Delete('/:content_id')
  async removeLessonContent(
    @Param('content_id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.lessonContentManagerApiService.removeLessonContent(id)
  }

  @Get('/:content_id/environments')
  async getContentEnvironments(
    @Param('content_id', new ParseUUIDPipe()) content_id: string,
  ): Promise<Environment[]> {
    return await this.lessonContentManagerApiService.getContentEnvironments(content_id)
  }

  @Post('/:content_id/environments')
  async addContentEnvironment(
    @Param('content_id', new ParseUUIDPipe()) content_id: string,
    @Body() dto: AddContentEnvironmentDto,
  ): Promise<MessageDto> {
    return await this.lessonContentManagerApiService.addContentEnvironment(content_id, dto)
  }

  @Delete('/:content_id/environments/:environment_id')
  async removeContentEnvironment(
    @Param('content_id', new ParseUUIDPipe()) content_id: string,
    @Param('environment_id', new ParseUUIDPipe()) environment_id: string,
  ): Promise<MessageDto> {
    return await this.lessonContentManagerApiService.removeContentEnvironment(
      content_id,
      { environment_id },
    )
  }

  @Patch('/:content_id/environments/:environment_id/order')
  async updateContentEnvironmentOrder(
    @Param('content_id', new ParseUUIDPipe()) content_id: string,
    @Param('environment_id', new ParseUUIDPipe()) environment_id: string,
    @Body() dto: UpdateContentEnvironmentOrderDto,
  ): Promise<MessageDto> {
    return await this.lessonContentManagerApiService.updateContentEnvironmentOrder(
      content_id,
      { ...dto, environment_id },
    )
  }
}
