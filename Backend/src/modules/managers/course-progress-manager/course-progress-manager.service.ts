import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsRelations } from 'typeorm'

import { LessonService } from '@/modules/core/lesson/lesson.service'

import { CourseProgressSearch } from '../../../api/manager/course-progress-manager-api/dtos/course-progress-search'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseProgress } from '../../core/course-progress/course-progress.entity'
import { CourseProgressService } from '../../core/course-progress/course-progress.service'
import { Course } from '../../core/course/course.entity'
import { LessonContent } from '../../core/lesson-content/lesson-content.entity'
import { CourseManagerService } from '../course-manager/course-manager.service'
import { StudentManagerService } from '../student-manager/student-manager.service'

@Injectable()
export class CourseProgressManagerService {
  constructor(
    private lessonService: LessonService,
    private courseProgressService: CourseProgressService,
    private courseManagerService: CourseManagerService,
    private studentManagerService: StudentManagerService,
  ) {}

  async getList(dto: CourseProgressSearch): Promise<PageDto<CourseProgress>> {
    return await this.courseProgressService.getList(dto)
  }

  async getCourseProgressContent(id: string): Promise<Course> {
    return await this.courseManagerService.getCourse(id, {
      units: {
        lessons: {
          contents: { validations: true },
        },
      },
    })
  }

  async getProgress(
    id: string,
    relations?: FindOptionsRelations<CourseProgress>,
  ): Promise<CourseProgress> {
    const progress = await this.courseProgressService.findOne({
      where: { id },
      relations,
    })
    if (!progress) throw new NotFoundException("progress doesn't exist")
    return progress
  }

  async getByStudentAndCourse(student_id: string): Promise<CourseProgress[]> {
    const progress = await this.courseProgressService.find(
      {
        student: { id: student_id },
      },
      { completed_chalanges: true },
    )
    return progress
  }

  async create(): Promise<CourseProgress> {
    const progress = await this.courseProgressService.create({})
    return progress
  }

  async isLessonStudentProgressOver90Percent(
    student_id: string,
    lesson_id: string,
  ): Promise<boolean> {
    const progress = await this.courseProgressService.findOne({
      where: {
        student: { id: student_id },
      },
      relations: {
        completed_chalanges: {
          lesson: true,
        },
      },
    })

    if (!progress) return false

    const completed_challenges = progress.completed_chalanges.filter(
      (challenge) => challenge.lesson.id === lesson_id,
    )

    if (!completed_challenges.length) return false

    const lesson = await this.lessonService.findOne({
      where: { id: lesson_id },
      relations: {
        contents: { validations: true },
      },
    })

    if (!lesson) return false

    const lesson_challenges = lesson.contents.filter(
      (content) => content.validations.length,
    )

    if (!lesson_challenges.length) return false
    const percent =
      (completed_challenges.length / lesson_challenges.length) * 100
    return percent > 90
  }

  async completeLesson(
    course_id: string,
    student_id: string,
    module_id: string,
    lesson_content: LessonContent,
  ): Promise<void> {
    const progress = await this.courseProgressService.findOne({
      where: {
        student: { id: student_id },
      },
      relations: {
        completed_chalanges: true,
      },
    })
    if (!progress) {
      const student = await this.studentManagerService.getStudent(student_id)
      await this.courseProgressService.create({
        student,
        completed_chalanges: [lesson_content],
      })
    } else {
      progress.completed_chalanges.push(lesson_content)
      await this.courseProgressService.repository.save(progress)
    }
  }
}
