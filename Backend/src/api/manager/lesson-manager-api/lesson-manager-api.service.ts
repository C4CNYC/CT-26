/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Injectable } from '@nestjs/common'

import { LessonContentType } from '@/modules/core/lesson-content/enums/lesson-content-type.enums'
import { UserService } from '@/modules/core/user/user.service'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { EnvironmentsService } from '../../../api/manager/environments/environments.service'
import { Integration } from '../../../modules/core/integration/integration.entity'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { Skill } from '../../../modules/core/skills/skill.entity'
import { IntegrationManagerService } from '../../../modules/managers/content-integration-manager/content-integration-manager.service'
import { LessonContentManagerService } from '../../../modules/managers/lesson-content-manager/lesson-content-manager.service'
import {
  createLessonUsingN8nProps,
  CreateLessonUsingOpenAIAssistantProps,
  LessonManagerService,
} from '../../../modules/managers/lesson-manager/lesson-manager.service'
import { SkillManagerService } from '../../../modules/managers/skill-manager/skill-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateLessonContentDto } from '../lesson-content-manager-api/dtos/create-content-lesson.dto'
import { AddEnvironmentDto } from './dtos/add-environment.dto'
import { AddIntegrationDto } from './dtos/add-integration.dto'
import { AddSkillDto } from './dtos/add-skill.dto'
import { CreateLessonDto } from './dtos/create-lesson.dto'
import { LessonSearchOptions } from './dtos/lesson-search-option.dto'
import { RemoveEnvironmentDto } from './dtos/remove-environment.dto'
import { RemoveIntegrationDto } from './dtos/remove-integration.dto'
import { RemoveSkillDto } from './dtos/remove-skill.dto'
import { UpdateEnvironmentOrderDto } from './dtos/update-environment-order.dto'
import { UpdateLessonDto } from './dtos/update-lesson.dto'

@Injectable()
export class LessonManagerApiService {
  constructor(
    private lessonManagerService: LessonManagerService,
    private skillManagerService: SkillManagerService,
    private integrationManagerService: IntegrationManagerService,
    private userService: UserService,
    private lessonContentManagerService: LessonContentManagerService,
    private environmentsService: EnvironmentsService,
  ) {}

  async getLessonList(
    userId: string,
    dto: LessonSearchOptions,
  ): Promise<PageDto<Lesson>> {
    const user = await this.userService.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    return await this.lessonManagerService.getList(userId, dto)
  }
  getPublicLessonList(dto: LessonSearchOptions): Promise<PageDto<Lesson>> {
    return this.lessonManagerService.getList(undefined, dto)
  }

  async getOwnLessonList(
    userId: string,
    dto: LessonSearchOptions,
  ): Promise<PageDto<Lesson>> {
    const user = await this.userService.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    return await this.lessonManagerService.getOwnList(userId, dto)
  }
  async checkSlug(slug: string): Promise<boolean> {
    return await this.lessonManagerService.checkSlug(slug)
  }
  async getLesson(id: string): Promise<Lesson> {
    return await this.lessonManagerService.getLesson(id)
  }

  async createLesson(
    userId: string,
    dto: CreateLessonDto,
    school_id: string,
  ): Promise<Lesson> {
    if (!dto.slug) {
      dto.slug = `${(new Date().getTime() - 1729692100000).toString(36)}`
    }

    try {
      return await this.lessonManagerService.create(userId, dto, school_id)
    } catch {
      dto.slug = `${(new Date().getTime() - 1729692100000).toString(36)}${Math.random()}`
      return await this.lessonManagerService.create(userId, dto, school_id)
    }
  }

  async createByCloningLesson(
    userId: string,
    school_id: string,
    lesson_id?: string,
  ): Promise<Lesson | Error> {
    return await this.lessonManagerService.createByCloning(
      userId,
      lesson_id,
      school_id,
    )
  }
  async updateLesson(id: string, dto: UpdateLessonDto): Promise<MessageDto> {
    const message = new MessageDto('Lesson updated')
    try {
      await this.lessonManagerService.update(id, dto)
    } catch (e) {
      throw new BadRequestException(`Update error`)
    }
    return message
  }

  async removeLesson(id: string): Promise<MessageDto> {
    await this.lessonManagerService.remove(id)
    return new MessageDto('Lesson removed')
  }

  async getIntegrations(content_id: string): Promise<Integration[]> {
    const content = await this.lessonManagerService.getLesson(content_id, {
      integrations: true,
    })
    return content.integrations
  }

  async addIntegration(
    content_id: string,
    dto: AddIntegrationDto,
  ): Promise<MessageDto> {
    const integration = await this.integrationManagerService.getIntegration(
      dto.integration_id,
    )
    await this.lessonManagerService.addIntegration(content_id, integration)
    return new MessageDto('integration added')
  }

  async removeIntegration(
    content_id: string,
    dto: RemoveIntegrationDto,
  ): Promise<MessageDto> {
    await this.lessonManagerService.removeIntegration(
      content_id,
      dto.integration_id,
    )
    return new MessageDto('integration removed')
  }

  async getSkills(lesson_id: string): Promise<Skill[]> {
    const content = await this.lessonManagerService.getLesson(lesson_id, {
      skills: true,
    })
    return content.skills
  }

  async addSkill(lesson_id: string, dto: AddSkillDto): Promise<MessageDto> {
    const skill = await this.skillManagerService.getById(dto.skill_id)
    await this.lessonManagerService.addSkill(lesson_id, skill)
    return new MessageDto('integration added')
  }

  async removeSkill(
    lesson_id: string,
    dto: RemoveSkillDto,
  ): Promise<MessageDto> {
    await this.lessonManagerService.removeSkill(lesson_id, dto.skill_id)
    return new MessageDto('integration removed')
  }

  async getEnvironments(lesson_id: string): Promise<Environment[]> {
    const content = await this.lessonManagerService.getLesson(lesson_id, {
      environments: true,
    })
    return content.environments
  }

  async addEnvironment(
    lesson_id: string,
    dto: AddEnvironmentDto,
  ): Promise<MessageDto> {
    const environment = await this.environmentsService.findOne(dto.environment_id)
    if (!environment) {
      throw new BadRequestException(`Environment with ID ${dto.environment_id} not found`)
    }
    await this.lessonManagerService.addEnvironment(lesson_id, environment)
    return new MessageDto('environment added')
  }

  async removeEnvironment(
    lesson_id: string,
    dto: RemoveEnvironmentDto,
  ): Promise<MessageDto> {
    await this.lessonManagerService.removeEnvironment(lesson_id, dto.environment_id)
    return new MessageDto('environment removed')
  }

  async updateEnvironmentOrder(
    lesson_id: string,
    dto: UpdateEnvironmentOrderDto,
  ): Promise<MessageDto> {
    await this.lessonManagerService.updateEnvironmentOrder(
      lesson_id,
      dto.environment_id,
      dto.sort,
    )
    return new MessageDto('environment order updated')
  }

  async generateFullLesson(
    userId: string,
    data: any,
    school_id: string,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lessonData = await this.lessonManagerService.generateFull(data)

    let createdLesson: Lesson
    if (data.newLessonId) {
      createdLesson = await this.lessonManagerService.getLesson(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        data.newLessonId,
        {
          integrations: false,
          skills: false,
        },
      )
      createdLesson.description = lessonData.lesson.description || ''
      createdLesson.name = lessonData.lesson?.title || 'Ai Lesson'
      createdLesson.duration = data.lessonDuration
      createdLesson.contents = undefined as any
      createdLesson.integrations = undefined as any
      createdLesson.skills = undefined as any
      await this.lessonManagerService.update(createdLesson.id, createdLesson)
    } else {
      createdLesson = await this.createLesson(
        userId,
        {
        description: lessonData.lesson.description,
        name: lessonData.lesson?.title,
        duration: data.lessonDuration,
        } as CreateLessonDto,
        school_id,
      )
    }

    // TODO: Generate Image from lessonData.supportingElements.image_prompt
    for (let i = 0; i < lessonData.slides?.length; i++) {
      const slide = lessonData.slides[i]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const slideContent = JSON.parse(slide.body)
      const content: CreateLessonContentDto = {
        body: JSON.stringify({
          content: slideContent?.content ? slideContent.content : slideContent,
          doc: slideContent?.content ? slideContent.content : slideContent,
        }),
        type: slide.type || LessonContentType.Editable, // This still works as it resolves to a string
        title: slide.title,
        preload_body: slide.preload_body,
        solution_body: slide.solution_body,
        tips: slide.tips,
        active: true,
        draft: false,
        meta: {
          order: i + 1,
        },
      } as unknown as CreateLessonContentDto

      await this.lessonContentManagerService.create(createdLesson.id, content)
    }

    return createdLesson
  }

  async generateLesson(
    userId: string,
    data: any,
    school_id: string,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lessonData = await this.lessonManagerService.generate(data)

    let createdLesson: Lesson
    if (data.newLessonId) {
      createdLesson = await this.lessonManagerService.getLesson(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        data.newLessonId,
      )
      createdLesson.description = lessonData.supportingElements.description
      createdLesson.name = lessonData.supportingElements?.title
      createdLesson.duration = data.lessonDuration
      createdLesson.contents = undefined as any
      createdLesson.integrations = undefined as any
      createdLesson.skills = undefined as any
      await this.lessonManagerService.update(createdLesson.id, createdLesson)
    } else {
      createdLesson = await this.createLesson(
        userId,
        {
        description: lessonData.supportingElements.description,
        name: lessonData.supportingElements?.title,
        duration: data.lessonDuration,
        } as CreateLessonDto,
        school_id,
      )
    }

    // TODO: Generate Image from lessonData.supportingElements.image_prompt

    console.log(createdLesson)
    const lessonContent: CreateLessonContentDto = {
      body: JSON.stringify({
        content: lessonData.lesson,
        doc: lessonData.lesson,
      }),
      type: data.type || LessonContentType.Code, // This still works as it resolves to a string
      title: lessonData.supportingElements?.title,
      preload_body: lessonData.supportingElements?.preloaded_code,
      solution_body: lessonData.supportingElements?.solution_code,
      tips: lessonData.supportingElements?.hint,
      active: true,
      draft: false,
    } as unknown as CreateLessonContentDto

    const createdLessonContent = await this.lessonContentManagerService.create(
      createdLesson.id,
      lessonContent,
    )
    console.log(createdLessonContent)

    return createdLesson
  }
  async n8nRequest(endPointPath: string, prompt: string): Promise<any> {
    return await this.lessonManagerService.n8nRequest(endPointPath, prompt)
  }
  async openAiRequest(prompt: string, add_response_format: boolean) {
    return await this.lessonManagerService.openAiRequest(
      prompt,
      add_response_format,
    )
  }
  
  createLessonUsingN8n(userId: string, data:createLessonUsingN8nProps): any {
    return this.lessonManagerService.createLessonUsingN8n(userId, data)
  }
  async createLessonUsingOpenAIAssistant(
    userId: string,
    prompt: CreateLessonUsingOpenAIAssistantProps,
    school_id: string,
  ) {
    return await this.lessonManagerService.createLessonUsingOpenAIAssistant(
      userId,
      prompt,
      school_id,
    )
  }

  async createLessonUsingOpenAIAssistantBeta(
    userId: string,
    prompt: any,
    school_id: string,
  ) {
    return await this.lessonManagerService.createLessonUsingOpenAIAssistant(
      userId,
      prompt,
      school_id,
    )
  }
}
