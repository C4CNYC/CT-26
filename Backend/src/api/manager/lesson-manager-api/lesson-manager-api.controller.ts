/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
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

import {
  createLessonUsingN8nProps,
  CreateLessonUsingOpenAIAssistantProps,
} from '@/modules/managers/lesson-manager/lesson-manager.service'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { AuthUser } from '@/old-auth/decorators/user.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { Integration } from '../../../modules/core/integration/integration.entity'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { Skill } from '../../../modules/core/skills/skill.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { AddEnvironmentDto } from './dtos/add-environment.dto'
import { AddIntegrationDto } from './dtos/add-integration.dto'
import { AddSkillDto } from './dtos/add-skill.dto'
import { LessonSearchOptions } from './dtos/lesson-search-option.dto'
import { RemoveEnvironmentDto } from './dtos/remove-environment.dto'
import { RemoveIntegrationDto } from './dtos/remove-integration.dto'
import { RemoveSkillDto } from './dtos/remove-skill.dto'
import { UpdateEnvironmentOrderDto } from './dtos/update-environment-order.dto'
import { UpdateLessonDto } from './dtos/update-lesson.dto'
import { LessonManagerApiService } from './lesson-manager-api.service'

@ApiTags('Lesson API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/lesson')
export class LessonManagerApiController {
  constructor(private lessonManagerApiService: LessonManagerApiService) {}
  @Get()
  async getLessonList(
    @Query() dto: LessonSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<Lesson>> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.lessonManagerApiService.getLessonList(userId, dto)
  }

  @Get('/own')
  async getOwnLessonList(
    @Query() dto: LessonSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<Lesson>> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.lessonManagerApiService.getOwnLessonList(userId, dto)
  }

  @Get('/:id')
  async getLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Lesson> {
    return await this.lessonManagerApiService.getLesson(id)
  }

  @Post()
  async createLesson(
    @Body() dto: UpdateLessonDto,
    @AuthUser() userId: string,
    @Request() request: RequestWithMeta,
  ): Promise<Lesson> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.lessonManagerApiService.createLesson(
      userId,
      dto,
      request.school_id,
    )
  }

  @Get('/checkSlug/:slug')
  async checkSlug(@Param('slug') slug: string): Promise<boolean> {
    return await this.lessonManagerApiService.checkSlug(slug)
  }
  @Post('/generate')
  async generateLesson(
    @Body() data: any,
    @AuthUser() userId: string,
    @Request() request: RequestWithMeta,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    data.name = data.lessonPrompt as string
    return await this.lessonManagerApiService.generateLesson(
      userId,
      data,
      request.school_id,
    )
  }

  @Post('/generateMulti')
  async generateFullLesson(
    @Body() data: any,
    @AuthUser() userId: string,
    @Request() request: RequestWithMeta,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    data.name = data.lessonPrompt as string
    return await this.lessonManagerApiService.generateFullLesson(
      userId,
      data,
      request.school_id,
    )
  }

  @Post('/openAiRequest')
  async openAiRequest(
    @Body() data: { prompt: string; add_response_format?: string },
  ): Promise<string> {
    let add_response_format = true
    if (data.add_response_format) {
      if (data.add_response_format === 'false') add_response_format = false
    }
    return await this.lessonManagerApiService.openAiRequest(
      data.prompt,
      add_response_format,
    )
  }

  @Post('/n8nRequest')
  async n8nRequest(
    @Body() data: { endPointPath: string; prompt: string },
  ): Promise<string> {
    return await this.lessonManagerApiService.n8nRequest(
      data.endPointPath,
      data.prompt,
    )
  }
  @Post('/createLessonUsingN8n')
  async createLessonUsingN8n(
    @Body() data: createLessonUsingN8nProps,
    @AuthUser() userId: string,
  ): Promise<string> {
    return JSON.stringify(
      await this.lessonManagerApiService.createLessonUsingN8n(userId, data),
    )
  }

  @Post('/createLessonUsingOpenAIAssistant')
  async createLessonUsingOpenAIAssistant(
    @Body() data: CreateLessonUsingOpenAIAssistantProps,
    @AuthUser() userId: string,
    @Request() request: RequestWithMeta,
  ): Promise<string> {
    return JSON.stringify(
      await this.lessonManagerApiService.createLessonUsingOpenAIAssistant(
        userId,
        data,
        request.school_id,
      ),
    )
  }

  @Post('/createLessonUsingOpenAIAssistantBeta')
  async createLessonUsingOpenAIAssistantBeta(
    @Body() data: { prompt: string },
    @AuthUser() userId: string,
    @Request() request: RequestWithMeta,
  ): Promise<string> {
    return JSON.stringify(
      await this.lessonManagerApiService.createLessonUsingOpenAIAssistantBeta(
        userId,
        data,
        request.school_id,
      ),
    )
  }

  @Post('/createByCloningLesson')
  async createByCloningLesson(
    @AuthUser() userId: string,
    @Request() request: RequestWithMeta,
  ): Promise<Lesson | Error> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.lessonManagerApiService.createByCloningLesson(
      userId,
      request.school_id,
    )
  }
  @Post('/clone/:lesson_id')
  async cloneLesson(
    @Param('lesson_id', new ParseUUIDPipe()) lesson_id: string,
    @AuthUser() userId: string,
    @Request() request: RequestWithMeta,
  ): Promise<Lesson | Error> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.lessonManagerApiService.createByCloningLesson(
      userId,
      request.school_id,
      lesson_id,
    )
  }

  @Patch('/:id')
  async updateLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateLessonDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.updateLesson(id, dto)
  }

  @Get('/:id/integration')
  async getIntegrations(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Integration[]> {
    return await this.lessonManagerApiService.getIntegrations(id)
  }

  @Patch('/:id/integration')
  async addIntegration(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddIntegrationDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.addIntegration(id, dto)
  }

  @Delete('/:id/integration')
  async removeIntegration(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: RemoveIntegrationDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.removeIntegration(id, dto)
  }

  @Get('/:id/skill')
  async getSkills(
    @Param('id', new ParseUUIDPipe()) content_id: string,
  ): Promise<Skill[]> {
    return await this.lessonManagerApiService.getSkills(content_id)
  }

  @Patch('/:id/skill')
  async addSkill(
    @Param('id', new ParseUUIDPipe()) content_id: string,
    @Body() dto: AddSkillDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.addSkill(content_id, dto)
  }

  @Delete('/:id/skill')
  async removeSkill(
    @Param('id', new ParseUUIDPipe()) content_id: string,
    @Body() dto: RemoveSkillDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.removeSkill(content_id, dto)
  }

  @Delete('/:id')
  async removeLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.removeLesson(id)
  }

  @Get('/:id/environment')
  async getEnvironments(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Environment[]> {
    return await this.lessonManagerApiService.getEnvironments(id)
  }

  @Patch('/:id/environment')
  async addEnvironment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddEnvironmentDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.addEnvironment(id, dto)
  }

  @Delete('/:id/environment')
  async removeEnvironment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: RemoveEnvironmentDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.removeEnvironment(id, dto)
  }

  @Patch('/:id/environment/order')
  async updateEnvironmentOrder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEnvironmentOrderDto,
  ): Promise<MessageDto> {
    return await this.lessonManagerApiService.updateEnvironmentOrder(id, dto)
  }
}
