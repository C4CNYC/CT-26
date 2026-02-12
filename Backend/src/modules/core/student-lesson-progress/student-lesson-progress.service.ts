import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CompleteLessonDto } from '../../../api/student/student-progress-api/dtos/complete-lesson.dto'
import { BaseService } from '../../../utils/base/base.service'
import { LessonService } from '../lesson/lesson.service'
import { StudentLessonProgress } from './student-lesson-progress.entity'

export interface ContinueLessonRaw {
  courseId: string
  unitId: string
  lessonId: string
}

@Injectable()
export class StudentLessonProgressService extends BaseService<StudentLessonProgress> {
  constructor(
    @InjectRepository(StudentLessonProgress)
    public repository: Repository<StudentLessonProgress>,

    private readonly lessonService: LessonService,
  ) {
    super(StudentLessonProgress, repository)
  }

  async completeLesson(dto: CompleteLessonDto) {
    const record = this.repository.create({
      studentId: dto.studentId,
      lessonId: dto.lessonId,
      completedAt: new Date(),
      isVisited: true,
      visitedAt: new Date(),
    })

    await this.repository.save(record)

    return { success: true }
  }

  async visitLesson(studentId: string, lessonId: string) {
    const lastVisited = await this.repository
      .createQueryBuilder('p')
      .where('p.studentId = :studentId', { studentId })
      .andWhere('p.isVisited = true')
      .orderBy('p.visitedAt', 'DESC')
      .getOne()

    if (!lastVisited) {
      await this.repository.save({
        studentId,
        lessonId,
        isVisited: true,
        visitedAt: new Date(),
      })
      return { success: true }
    }

    const newLessonSort = await this.lessonService.getLessonSort(lessonId)

    const lastVisitedSort = await this.lessonService.getLessonSort(
      lastVisited.lessonId,
    )

    if (
      typeof newLessonSort?.sort === 'number' &&
      typeof lastVisitedSort?.sort === 'number' &&
      newLessonSort.sort > lastVisitedSort.sort
    ) {
      await this.repository.save({
        studentId,
        lessonId,
        isVisited: true,
        visitedAt: new Date(),
      })
    }

    return { success: true }
  }

  async getContinueLessonForCourse(
    studentId: string,
    courseId: string,
  ): Promise<ContinueLessonRaw | undefined> {
    const visited = await this.getLastVisitedLesson(studentId, courseId)
    if (visited) return visited

    const completed = await this.getLastCompletedLesson(studentId, courseId)
    if (completed) return completed

    return await this.lessonService.findFirstLessonByCourse(courseId)
  }

  async getContinueLessonForUnit(
    studentId: string,
    unitId: string,
  ): Promise<ContinueLessonRaw | undefined> {
    const visited = await this.getLastVisitedLessonForModule(studentId, unitId)
    if (visited) return visited

    const completed = await this.getLastCompletedLessonForModule(
      studentId,
      unitId,
    )
    if (completed) return completed

    return await this.lessonService.findFirstLessonByUnit(unitId)
  }

  /** helpers **/
  private async getLastVisitedLesson(studentId: string, courseId: string) {
    return await this.repository
      .createQueryBuilder('p')
      .innerJoin('p.lesson', 'lesson')
      .innerJoin('lesson.lessonToUnits', 'ltu')
      .innerJoin('ltu.courseUnit', 'unit')
      .innerJoin('unit.courses', 'course')
      .where('p.studentId = :studentId', { studentId })
      .andWhere('p.isVisited = true')
      .andWhere('course.id = :courseId', { courseId })
      .orderBy('p.visitedAt', 'DESC')
      .select([
        'lesson.id AS "lessonId"',
        'unit.id AS "unitId"',
        'course.id AS "courseId"',
      ])
      .getRawOne<ContinueLessonRaw>()
  }

  private async getLastCompletedLesson(studentId: string, courseId: string) {
    return await this.repository
      .createQueryBuilder('p')
      .innerJoin('p.lesson', 'lesson')
      .innerJoin('lesson.lessonToUnits', 'ltu')
      .innerJoin('ltu.courseUnit', 'unit')
      .innerJoin('unit.courses', 'course')
      .where('p.studentId = :studentId', { studentId })
      .andWhere('p.completedAt IS NOT NULL')
      .andWhere('course.id = :courseId', { courseId })
      .orderBy('p.completedAt', 'DESC')
      .select([
        'lesson.id AS "lessonId"',
        'unit.id AS "unitId"',
        'course.id AS "courseId"',
      ])
      .getRawOne<ContinueLessonRaw>()
  }

  private async getLastVisitedLessonForModule(
    studentId: string,
    moduleId: string,
  ) {
    return await this.repository
      .createQueryBuilder('p')
      .innerJoin('p.lesson', 'lesson')
      .innerJoin('lesson.lessonToUnits', 'ltu')
      .innerJoin('ltu.courseUnit', 'unit')
      .where('p.studentId = :studentId', { studentId })
      .andWhere('p.isVisited = true')
      .andWhere('unit.id = :moduleId', { moduleId })
      .orderBy('p.visitedAt', 'DESC')
      .select([
        'lesson.id AS "lessonId"',
        'unit.id AS "unitId"',
        `(SELECT cuc."coursesId"
        FROM courses_units_course_units cuc
        WHERE cuc."courseUnitsId" = unit.id
        LIMIT 1) AS "courseId"`,
      ])
      .getRawOne<ContinueLessonRaw>()
  }

  private async getLastCompletedLessonForModule(
    studentId: string,
    moduleId: string,
  ) {
    return await this.repository
      .createQueryBuilder('p')
      .innerJoin('p.lesson', 'lesson')
      .innerJoin('lesson.lessonToUnits', 'ltu')
      .innerJoin('ltu.courseUnit', 'unit')
      .where('p.studentId = :studentId', { studentId })
      .andWhere('p.completedAt IS NOT NULL')
      .andWhere('unit.id = :moduleId', { moduleId })
      .orderBy('p.completedAt', 'DESC')
      .select([
        'lesson.id AS "lessonId"',
        'unit.id AS "unitId"',
        `(SELECT cuc."coursesId"
        FROM courses_units_course_units cuc
        WHERE cuc."courseUnitsId" = unit.id
        LIMIT 1) AS "courseId"`,
      ])
      .getRawOne<ContinueLessonRaw>()
  }
  /** helpers end **/
}
