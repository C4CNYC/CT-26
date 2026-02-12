import { BadRequestException, Injectable } from '@nestjs/common'

import { LessonContentFile } from '@/modules/core/lesson-content-file/lesson-content-file.entity'

import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { EnvironmentsService } from '../../../api/manager/environments/environments.service'
import { LessonContent } from '../../../modules/core/lesson-content/lesson-content.entity'
import { LessonContentManagerService } from '../../../modules/managers/lesson-content-manager/lesson-content-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { AddContentEnvironmentDto } from './dtos/add-content-environment.dto'
import { CreateContentLessonFileDto } from './dtos/create-content-lesson-file.dto'
import { CreateLessonContentDto } from './dtos/create-content-lesson.dto'
import { RemoveContentEnvironmentDto } from './dtos/remove-content-environment.dto'
import { UpdateContentEnvironmentOrderDto } from './dtos/update-content-environment-order.dto'
import { UpdateContentLessonFileDto } from './dtos/update-content-lesson-file.dto'
import { UpdateLessonContentDto } from './dtos/update-content-lesson.dto'

@Injectable()
export class LessonContentManagerApiService {
  constructor(
    private lessonContentManagerService: LessonContentManagerService,
    private environmentsService: EnvironmentsService,
  ) {}

  async updateLessonContentFile(
    content_id: string,
    file_id: string,
    dto: UpdateContentLessonFileDto,
  ): Promise<MessageDto> {
    await this.lessonContentManagerService.updateLessonContentFile(
      content_id,
      file_id,
      dto,
    )
    return new MessageDto('Lesson content file updated')
  }

  async addLessonContentFile(
    id: string,
    dto: CreateContentLessonFileDto,
  ): Promise<LessonContentFile> {
    return await this.lessonContentManagerService.addLessonContentFile(id, dto)
  }

  async getLessonContent(id: string): Promise<LessonContent[]> {
    return await this.lessonContentManagerService.getLessonContent(id)
  }

  async getLessonContentById(id: string): Promise<LessonContent> {
    return await this.lessonContentManagerService.getLessonContentById(id)
  }

  async getLessonContentFiles(id: string): Promise<LessonContentFile[]> {
    return await this.lessonContentManagerService.getLessonContentFiles(id)
  }

  async getLessonFiles(id: string): Promise<LessonContentFile[]> {
    return await this.lessonContentManagerService.getLessonFiles(id)
  }

  async createLessonContent(
    id: string,
    dto: CreateLessonContentDto,
  ): Promise<LessonContent> {
    return await this.lessonContentManagerService.create(id, dto)
  }

  async updateLessonContent(
    id: string,
    content_id: string,
    dto: UpdateLessonContentDto,
  ): Promise<MessageDto> {
    await this.lessonContentManagerService.update(id, content_id, dto)
    return new MessageDto('Lesson updated')
  }

  async removeLessonContentFile(
    content_id: string,
    file_id: string,
  ): Promise<MessageDto> {
    await this.lessonContentManagerService.removeLessonContentFile(
      content_id,
      file_id,
    )
    return new MessageDto('Lesson file removed')
  }

  async removeLessonContent(id: string): Promise<MessageDto> {
    await this.lessonContentManagerService.remove(id)
    return new MessageDto('Lesson removed')
  }

  async getContentEnvironments(content_id: string): Promise<Environment[]> {
    return await this.lessonContentManagerService.getEnvironments(content_id)
  }

  async addContentEnvironment(
    content_id: string,
    dto: AddContentEnvironmentDto,
  ): Promise<MessageDto> {
    const environment = await this.environmentsService.findOne(dto.environment_id)
    if (!environment) {
      throw new BadRequestException(`Environment with ID ${dto.environment_id} not found`)
    }
    await this.lessonContentManagerService.addEnvironment(content_id, environment)
    return new MessageDto('environment added')
  }

  async removeContentEnvironment(
    content_id: string,
    dto: RemoveContentEnvironmentDto,
  ): Promise<MessageDto> {
    await this.lessonContentManagerService.removeEnvironment(content_id, dto.environment_id)
    return new MessageDto('environment removed')
  }

  async updateContentEnvironmentOrder(
    content_id: string,
    dto: UpdateContentEnvironmentOrderDto,
  ): Promise<MessageDto> {
    await this.lessonContentManagerService.updateEnvironmentOrder(
      content_id,
      dto.environment_id,
      dto.sort,
    )
    return new MessageDto('environment order updated')
  }
}
