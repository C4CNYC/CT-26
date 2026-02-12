import { Injectable } from '@nestjs/common'

import { CreateLessonLastSlideDto } from '@/api/student/lesson-last-slide/dto/create-lesson-last-slide.dto'
import { LessonLastSlideService } from '@/modules/core/lesson-last-slide/lesson-last-slide.service'
import { MessageDto } from '@/utils/dtos/message.dto'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

@Injectable()
export class LessonLastSlideApiService {
  constructor(private lessonLastSlideService: LessonLastSlideService) {}

  async changeSlide(dto: CreateLessonLastSlideDto, request: RequestWithMeta) {
    const slideExist = await this.lessonLastSlideService.findOne({
      where: {
        lessonId: dto.lessonId,
        studentId: request.user.studentID,
      },
    })
    if (slideExist) {
      await this.lessonLastSlideService.update(slideExist.id, {
        ...dto,
        studentId: request.user.studentID,
      })
      return new MessageDto('Last slide updated')
    } else {
      return await this.lessonLastSlideService.create({
        ...dto,
        studentId: request.user.studentID,
      })
    }
  }

  async getSlide(lessonId: string, request: RequestWithMeta) {
    const slideExist = await this.lessonLastSlideService.findOne({
      where: {
        lessonId,
        studentId: request.user.studentID,
      },
    })
    return (
      slideExist || {
        lessonId,
        studentId: request.user.studentID,
        slideNumber: 0,
      }
    )
  }
}
