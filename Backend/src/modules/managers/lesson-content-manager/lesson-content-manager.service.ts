import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsRelations, ILike, In } from 'typeorm'

import { CreateContentLessonFileDto } from '@/api/manager/lesson-content-manager-api/dtos/create-content-lesson-file.dto'
import { UpdateContentLessonFileDto } from '@/api/manager/lesson-content-manager-api/dtos/update-content-lesson-file.dto'
import { LessonContentFile } from '@/modules/core/lesson-content-file/lesson-content-file.entity'
import { LessonContentFileService } from '@/modules/core/lesson-content-file/lesson-content-file.service'
import { LessonType } from '@/modules/core/lesson/enums/lesson-type.enum'

import { CreateLessonContentDto } from '../../../api/manager/lesson-content-manager-api/dtos/create-content-lesson.dto'
import { UpdateLessonContentDto } from '../../../api/manager/lesson-content-manager-api/dtos/update-content-lesson.dto'
import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { LessonContent } from '../../core/lesson-content/lesson-content.entity'
import { LessonContentService } from '../../core/lesson-content/lesson-content.service'
import { LessonContentToEnvironment } from '../../core/lesson-content-to-environment/lesson-content-to-environment.entity'
import { LessonService } from '../../core/lesson/lesson.service'

@Injectable()
export class LessonContentManagerService {
  constructor(
    private lessonService: LessonService,
    private lessonContentService: LessonContentService,
    private lessonContentFileService: LessonContentFileService,
  ) { }
  async getLessonContent(id: string): Promise<LessonContent[]> {
    const lesson = await this.lessonService.findOne({
      where: { id },
      relations: {
        contents: true,
      },
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")
    return lesson.contents
  }

  async getChallenge(id: string): Promise<LessonContent> {
    const chalange = await this.lessonContentService.findOne({
      where: { id },
      relations: { validations: true },
    })
    if (!chalange) throw new NotFoundException("content doesn't exist")
    if (!chalange.validations.length)
      throw new NotFoundException("content doesn't not chalange")

    return chalange
  }

  async getLessonContentById(
    id: string,
    relations?: FindOptionsRelations<LessonContent>,
  ): Promise<LessonContent> {
    const content = await this.lessonContentService.findOne({
      where: { id },
      relations,
    })
    if (!content) throw new NotFoundException("content doesn't exist")
    return content
  }

  async getLessonContentFiles(id: string): Promise<LessonContentFile[]> {
    return await this.lessonContentFileService.find({
      lessonContent: { id },
    })
  }

  async getLessonFiles(lessonId: string): Promise<LessonContentFile[]> {
    const lesson = await this.lessonService.findOne({
      where: { id: lessonId },
      relations: { contents: true },
    })

    if (!lesson) throw new NotFoundException("lesson doesn't exist")

    const contentIds = lesson.contents.map((c) => c.id)

    if (!contentIds.length) return []

    return await this.lessonContentFileService.find({
      lessonContent: { id: In(contentIds) },
    })
  }

  async create(
    id: string,
    dto: CreateLessonContentDto,
  ): Promise<LessonContent> {
    const lesson = await this.lessonService.findOne({
      where: { id },
      relations: { contents: true },
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")
    const content = await this.lessonContentService.create(dto)
    lesson.contents.push(content)
    await this.lessonService.repository.save(lesson)
    return content
  }

  async update(
    id: string,
    content_id: string,
    dto: UpdateLessonContentDto,
  ): Promise<LessonContent> {
    const content = await this.lessonContentService.findOne({
      where: { lesson: { id }, id: content_id },
    })

    if (!content) throw new NotFoundException("content doesn't exist")
    await this.lessonContentService.update(content.id, dto)

    return content
  }

  async updateLessonContentFile(
    content_id: string,
    file_id: string,
    dto: UpdateContentLessonFileDto,
  ) {
    const lessonContent = await this.lessonContentService.findOne({
      where: { id: content_id },
      relations: { lesson: true },
    })

    if (!lessonContent) throw new NotFoundException("content doesn't exist")

    const lessonContentIds = (
      await this.lessonContentService.find({
        lesson: { id: lessonContent.lesson.id },
      })
    ).map((content) => content.id)
    if (lessonContent.lesson.type === LessonType.PRACTICAL) {
      const isFileWithSameNameExist = await this.lessonContentFileService.find({
        lessonContent: { id: In(lessonContentIds) },
        name: ILike(`${dto.name}`),
        extension: dto.extension,
      })

      if (isFileWithSameNameExist.length) {
        throw new NotFoundException(
          "You can't create more than one file with the same name per Practical lesson",
        )
      }
    }

    const lessonContentFile = await this.lessonContentFileService.findOne({
      where: { id: file_id },
    })

    if (!lessonContentFile) throw new NotFoundException("file doesn't exist")

    await this.lessonContentFileService.update(lessonContentFile.id, dto)
  }

  async addLessonContentFile(
    id: string,
    dto: CreateContentLessonFileDto,
  ): Promise<LessonContentFile> {
    const lessonContent = await this.lessonContentService.findOne({
      where: { id },
      relations: { lesson: true },
    })

    const lessonContentIds = (
      await this.lessonContentService.find({
        lesson: { id: lessonContent.lesson.id },
      })
    ).map((content) => content.id)

    if (lessonContent.lesson.type === LessonType.PRACTICAL) {
      const isFileWithSameNameExist = await this.lessonContentFileService.find({
        lessonContent: { id: In(lessonContentIds) },
        name: dto.name,
        extension: dto.extension,
      })

      if (isFileWithSameNameExist.length) {
        throw new NotFoundException(
          "You can't create more than one file with the same name per Practical lesson",
        )
      }
    }

    if (!lessonContent) throw new NotFoundException("content doesn't exist")

    return await this.lessonContentFileService.create({
      ...dto,
      lessonContent,
    })
  }

  async removeLessonContentFile(content_id: string, file_id: string) {
    const lessonContent = await this.lessonContentService.findOne({
      where: { id: content_id },
    })

    if (!lessonContent) throw new NotFoundException("content doesn't exist")

    const lessonContentFile = await this.lessonContentFileService.findOne({
      where: { id: file_id },
    })

    if (!lessonContentFile) throw new NotFoundException("file doesn't exist")

    await this.lessonContentFileService.remove(lessonContentFile.id)
  }

  async remove(id: string): Promise<void> {
    await this.lessonContentService.remove(id)
  }

  async addEnvironment(content_id: string, environment: Environment): Promise<void> {
    const content = await this.getLessonContentById(content_id)

    // Create the join table record directly
    const lessonContentToEnvironment = new LessonContentToEnvironment()
    lessonContentToEnvironment.lessonContentId = content_id
    lessonContentToEnvironment.environmentId = environment.id
    lessonContentToEnvironment.sort = 0 // Default sort value

    await this.lessonContentService.repository.manager
      .getRepository(LessonContentToEnvironment)
      .save(lessonContentToEnvironment)
  }

  async removeEnvironment(content_id: string, environment_id: string): Promise<void> {
    await this.lessonContentService.repository.manager
      .getRepository(LessonContentToEnvironment)
      .delete({
        lessonContentId: content_id,
        environmentId: environment_id,
      })
  }

  async updateEnvironmentOrder(content_id: string, environment_id: string, sort: number): Promise<void> {
    const lessonContentToEnvironment = await this.lessonContentService.repository.manager
      .getRepository(LessonContentToEnvironment)
      .findOne({
        where: {
          lessonContentId: content_id,
          environmentId: environment_id,
        },
      })

    if (!lessonContentToEnvironment) {
      throw new NotFoundException('Environment not found in lesson content')
    }

    lessonContentToEnvironment.sort = sort
    await this.lessonContentService.repository.manager
      .getRepository(LessonContentToEnvironment)
      .save(lessonContentToEnvironment)
  }

  async getEnvironments(content_id: string): Promise<Environment[]> {
    const lessonContent = await this.lessonContentService.findOne({
      where: { id: content_id },
      relations: {
        environments: true,
        lessonContentToEnvironments: { environment: true }
      }
    })

    if (!lessonContent) {
      throw new NotFoundException('Lesson content not found')
    }

    return lessonContent.environments
  }



}
