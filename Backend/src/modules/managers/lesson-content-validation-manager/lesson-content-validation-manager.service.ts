import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateLessonContentValidationDto } from '../../../api/manager/lesson-content-validation-manager-api/dtos/create-content-lesson-validation.dto'
import { UpdateLessonContenValidationtDto } from '../../../api/manager/lesson-content-validation-manager-api/dtos/update-content-lesson-validation.dto'
import { LessonContentValidator } from '../../core/lesson-content-validator/lesson-content-validator.entity'
import { LessonContentValidatorService } from '../../core/lesson-content-validator/lesson-content-validator.service'

@Injectable()
export class LessonContentValidationManagerService {
  constructor(private lessonContentValidator: LessonContentValidatorService) {}

  async getValidator(id: string): Promise<LessonContentValidator> {
    const validator = await this.lessonContentValidator.findOne({
      where: { id },
    })
    if (!validator) throw new NotFoundException("validator doesn't exist")
    return validator
  }

  async getValidatorList(lesson_id: string): Promise<LessonContentValidator[]> {
    return await this.lessonContentValidator.find({
      lesson_content: { id: lesson_id },
    })
  }

  async createValidator(
    dto: CreateLessonContentValidationDto,
  ): Promise<LessonContentValidator> {
    const validator = await this.lessonContentValidator.create(dto)
    return validator
  }

  async updateValidarot(
    id: string,
    dto: UpdateLessonContenValidationtDto,
  ): Promise<void> {
    await this.getValidator(id)
    await this.lessonContentValidator.update(id, dto)
  }

  async removeValidator(id: string): Promise<void> {
    await this.lessonContentValidator.remove(id)
  }
}
