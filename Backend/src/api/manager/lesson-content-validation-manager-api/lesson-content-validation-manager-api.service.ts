import { Injectable, NotFoundException } from '@nestjs/common'

import { LessonContentValidator } from '../../../modules/core/lesson-content-validator/lesson-content-validator.entity'
import { LessonContentService } from '../../../modules/core/lesson-content/lesson-content.service'
import { LessonContentValidationManagerService } from '../../../modules/managers/lesson-content-validation-manager/lesson-content-validation-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { CreateLessonContentValidationDto } from './dtos/create-content-lesson-validation.dto'
import { UpdateLessonContenValidationtDto } from './dtos/update-content-lesson-validation.dto'

@Injectable()
export class LessonContentValidationManagerApiService {
  constructor(
    private lessonContentValidationManagerService: LessonContentValidationManagerService,
    private lessonContentService: LessonContentService,
  ) {}

  async getLessonContentValidations(
    id: string,
  ): Promise<LessonContentValidator[]> {
    return await this.lessonContentValidationManagerService.getValidatorList(id)
  }

  async createLessonContentValidation(
    id: string,
    dto: CreateLessonContentValidationDto,
  ): Promise<LessonContentValidator> {
    const lessonContent = await this.lessonContentService.findOne({
      where: { id },
      relations: { validations: true },
    })
    if (!lessonContent)
      throw new NotFoundException("lesson content doesn't exist")
    const validator =
      await this.lessonContentValidationManagerService.createValidator(dto)
    lessonContent.validations.push(validator)
    await this.lessonContentService.repository.save(lessonContent)
    return validator
  }

  async updateLessonContentValidation(
    id: string,
    dto: UpdateLessonContenValidationtDto,
  ): Promise<MessageDto> {
    await this.lessonContentValidationManagerService.updateValidarot(id, dto)
    return new MessageDto('Lesson updated')
  }

  async removeLessonContentValidation(id: string): Promise<MessageDto> {
    await this.lessonContentValidationManagerService.removeValidator(id)
    return new MessageDto('Lesson removed')
  }
}
