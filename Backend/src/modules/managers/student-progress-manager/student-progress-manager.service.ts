import { Injectable, NotFoundException } from '@nestjs/common'

import { VisitLessonDto } from '@/api/student/student-progress-api/dtos/visit-lesson.dto'
import {
  ContinueLessonRaw,
  StudentLessonProgressService,
} from '@/modules/core/student-lesson-progress/student-lesson-progress.service'

import { ChompleteChalangeDTO } from '../../../api/student/student-progress-api/dtos/complete-chalange.dto'
import { CompleteLessonDto } from '../../../api/student/student-progress-api/dtos/complete-lesson.dto'
import { CourseProgressService } from '../../core/course-progress/course-progress.service'
import { LessonContentManagerService } from '../lesson-content-manager/lesson-content-manager.service'
import { StudentManagerService } from '../student-manager/student-manager.service'

@Injectable()
export class StudentProgressManagerService {
  constructor(
    private courseProgressService: CourseProgressService,
    private studentManagerService: StudentManagerService,
    private lessonContentManagerService: LessonContentManagerService,
    private studentLessonProgressService: StudentLessonProgressService,
  ) {}

  async completeChalange(
    student_id: string,
    dto: ChompleteChalangeDTO,
  ): Promise<void> {
    if (!dto.lesson_content_id)
      throw new NotFoundException('lesson content id not provided')

    const chalange = await this.lessonContentManagerService.getChallenge(
      dto.lesson_content_id,
    )
    const progress = await this.courseProgressService.findOne({
      where: { student: { id: student_id } },
      relations: { completed_chalanges: true },
    })

    if (!progress) {
      await this.courseProgressService.create({
        student: await this.studentManagerService.getStudent(student_id),
        completed_chalanges: [chalange],
        progress_meta: { body: dto.code ?? '' },
      })
    } else {
      progress.completed_chalanges.push(chalange)
      progress.progress_meta['body'] = dto.code ?? ''
      await this.courseProgressService.repository.save(progress)
    }
  }

  async getCompletedChallenged(student_id: string): Promise<object> {
    const progress = await this.courseProgressService.findOne({
      where: { student: { id: student_id } },
      relations: {
        completed_chalanges: {
          validations: true,
        },
      },
    })
    return progress
  }

  async getLessonProgressByStudent(student_id: string): Promise<object> {
    return await this.courseProgressService.getLessonProgressByStudent(
      student_id,
    )
  }

  async getLastLessonByCourse(
    student_id: string,
    course_id: string,
  ): Promise<ContinueLessonRaw | undefined> {
    return await this.studentLessonProgressService.getContinueLessonForCourse(
      student_id,
      course_id,
    )
  }

  async getLastLessonByModule(
    student_id: string,
    module_id: string,
  ): Promise<ContinueLessonRaw | undefined> {
    return await this.studentLessonProgressService.getContinueLessonForUnit(
      student_id,
      module_id,
    )
  }

  async completeLesson(dto: CompleteLessonDto) {
    return await this.studentLessonProgressService.completeLesson(dto)
  }

  async visitLesson(dto: VisitLessonDto) {
    return await this.studentLessonProgressService.visitLesson(
      dto.studentId,
      dto.lessonId,
    )
  }
}
