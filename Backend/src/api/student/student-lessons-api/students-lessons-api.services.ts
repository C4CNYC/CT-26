import { Injectable, NotFoundException } from '@nestjs/common'

import { CourseProgressService } from '../../../modules/core/course-progress/course-progress.service'
import { CourseUnitService } from '../../../modules/core/course-unit/course-unit.service'
import {
  CourseService,
  LessonCoursePlacement,
} from '../../../modules/core/course/course.service'
import { LessonContent } from '../../../modules/core/lesson-content/lesson-content.entity'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { LastVisitedData } from '../../../modules/core/student/interfaces'
import { StudentService } from '../../../modules/core/student/student.service'
import { LessonManagerService } from '../../../modules/managers/lesson-manager/lesson-manager.service'
import { LastVisitedUnitAndLessonDto } from '../../manager/school-student-manager-api/dtos/last-visited-unit-and-lesson.dto'

export type LessonWithCoursePlacement = Lesson & {
  coursePlacement: LessonCoursePlacement | null
}

@Injectable()
export class StudentLessonsApiService {
  constructor(
    private lessonManagerService: LessonManagerService,
    private studentService: StudentService,
    private courseService: CourseService,
    private courseUnitService: CourseUnitService,
    private courseProgressService: CourseProgressService,
  ) {}

  async getLesson(studentId: string | undefined, id: string): Promise<Lesson> {
    const lesson = await this.lessonManagerService.getLesson(id, {
      integrations: true,
      skills: true,
      contents: true,
    })
    await this.courseProgressService.attachStudentProgressToLessonContents(
      lesson.contents,
      studentId,
    )
    return lesson
  }

  async getLessonWithoutContent(
    student_id: string | undefined,
    id: string,
  ): Promise<LessonWithCoursePlacement> {
    const [lesson, course_placement] = await Promise.all([
      this.lessonManagerService.getLessonWithoutContent(id, {
        integrations: true,
        environments: true,
      }),
      this.courseService.findLessonCoursePlacement(id, student_id),
    ])
    return Object.assign(lesson, { coursePlacement: course_placement })
  }

  async getLessonContentList(
    studentId: string | undefined,
    id: string,
  ): Promise<LessonContent[]> {
    const lesson = await this.lessonManagerService.getLesson(id, {
      contents: { environments: true, validations: true },
    })
    await this.courseProgressService.attachStudentProgressToLessonContents(
      lesson.contents,
      studentId,
    )
    return lesson.contents
  }

  async getLastVisitedData(
    student_id: string,
    course_id: string,
  ): Promise<LastVisitedData> {
    const course = await this.courseService.findOne({
      where: { id: course_id },
    })
    if (!course)
      throw new NotFoundException(`Course ${course_id} doesn't exist`)

    if (!student_id) {
      throw new NotFoundException('Student not found')
    }

    const { lastVisitedUnitId, lastVisitedLessonId, lastVisitedCourseId } =
      await this.studentService.getLastVisitedData(student_id, course_id)

    if (!lastVisitedLessonId)
      throw new NotFoundException('last visited lesson not found')
    if (!lastVisitedUnitId)
      throw new NotFoundException('last visited unit not found')
    if (!lastVisitedCourseId)
      throw new NotFoundException('last visited course not found')

    return { lastVisitedUnitId, lastVisitedLessonId, lastVisitedCourseId }
  }

  async updateLastVisitedData(
    student_id: string,
    dto: LastVisitedUnitAndLessonDto,
  ) {
    const course = await this.courseService.findOne({
      where: { id: dto.courseId },
    })
    if (!course)
      throw new NotFoundException(`Course ${dto.courseId} doesn't exist`)

    const unit = await this.courseUnitService.findOne({
      where: { id: dto.unitId },
    })
    if (!unit) throw new NotFoundException(`Module ${dto.unitId} doesn't exist`)

    const lesson = await this.lessonManagerService.getLesson(dto.lessonId)
    if (!lesson)
      throw new NotFoundException(`Lesson ${dto.lessonId} doesn't exist`)

    const relation = await this.courseService.findOne({
      where: {
        id: dto.courseId,
        active: true,
        units: {
          id: dto.unitId,
          active: true,
          lessons: {
            id: dto.lessonId,
            active: true,
          },
        },
      },
      relations: {
        units: {
          lessons: true,
        },
      },
    })

    if (!relation)
      throw new NotFoundException(
        `There are no relations between course, module and lesson ids`,
      )

    return await this.studentService.updateLastVisitedData(student_id, {
      lesson,
      unit,
      course,
    })
  }
}
