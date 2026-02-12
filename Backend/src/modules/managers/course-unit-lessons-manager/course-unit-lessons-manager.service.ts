import { Injectable, NotFoundException } from '@nestjs/common'
import PostgresInterval from 'postgres-interval'

import { AddLessonToModuleDto } from '../../../api/manager/course-unit-manager-api/dtos/add-lesson-to-module.dto'
import { RemoveLessonFromModuleDto } from '../../../api/manager/course-unit-manager-api/dtos/remove-lesson-from-module.dto'
import { UpdateModuleLessonDto } from '../../../api/manager/course-unit-manager-api/dtos/update-module-lesson.dto'
import { CourseUnitService } from '../../core/course-unit/course-unit.service'
import { LessonToCourseUnitService } from '../../core/course-unit/lesson-to-course-unit.service'
import { LessonService } from '../../core/lesson/lesson.service'

@Injectable()
export class CourseUnitLessonsManagerService {
  constructor(
    private courseUnitService: CourseUnitService,
    private lessonService: LessonService,
    private lessonToCourseUnitService: LessonToCourseUnitService,
  ) {}

  async calculateUnitDuration(unitId: string) {
    const unit = await this.courseUnitService.getCourseUnit(unitId)
    const unitToUpdate = await this.courseUnitService.findOne({
      where: { id: unitId },
    })
    if (!unit) return console.log('notting found')

    const lessons = unit.lessons || []

    const durationInMins = lessons.reduce((sum: number, l) => {
      if (!l.duration) return sum + 20 //default 20 mins
      const { hours, minutes } = l.duration as unknown as {
        hours: number
        minutes: number
      }
      const lessonDuration = (hours || 0) * 60 + (minutes || 0)
      return sum + (lessonDuration || 20)
    }, 0)
    const hours = Math.floor(durationInMins / 60)
    const minutes = durationInMins % 60
    unitToUpdate.duration = PostgresInterval(`${hours}:${minutes}:00`)
    await this.courseUnitService.update(unitId, unitToUpdate)
  }

  async addLessonToModule(
    id: string,
    dto: AddLessonToModuleDto,
  ): Promise<void> {
    const unit = await this.courseUnitService.findOne({
      where: { id },
      // relations: { lessons: true },
    })
    if (!unit) throw new NotFoundException("module doesn't exist")

    const lesson = await this.lessonService.findOne({
      where: { id: dto.lesson_id },
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")

    // unit.lessons.push(lesson);
    // await this.courseUnitService.repository.save(unit);

    await this.lessonToCourseUnitService.create({
      lesson,
      courseUnit: unit,
      sort: Number.parseFloat(dto.sort ?? '0'),
    })
  }

  async removeLessonFromModule(
    id: string,
    dto: RemoveLessonFromModuleDto,
  ): Promise<void> {
    const unit = await this.courseUnitService.findOne({
      where: { id },
      // relations: { lessons: true },
    })
    if (!unit) throw new NotFoundException("module doesn't exist")

    const lesson = await this.lessonService.findOne({
      where: { id: dto.lesson_id },
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")

    const lessonToCourse = await this.lessonToCourseUnitService.findOne({
      where: { lessonId: dto.lesson_id, courseUnitId: id },
    })
    if (!lessonToCourse)
      throw new NotFoundException("lessonToCourse doesn't exist")

    await this.lessonToCourseUnitService.repository.delete({
      lessonId: dto.lesson_id,
      courseUnitId: id,
    })

    // unit.lessons = unit.lessons.filter((l) => l.id !== dto.lesson_id);
    // await this.courseUnitService.repository.save(unit);
  }

  async updateModuleLesson(
    id: string,
    dto: UpdateModuleLessonDto,
  ): Promise<void> {
    const lessonToCourseUnit = await this.lessonToCourseUnitService.findOne({
      where: { lessonId: dto.lesson_id, courseUnitId: id },
    })
    if (!lessonToCourseUnit)
      throw new NotFoundException("lessonToCourseUnit doesn't exist")

    const sort = Number.parseFloat(dto.sort)
    if (!Number.isNaN(sort)) {
      lessonToCourseUnit.sort = sort
    }

    await this.lessonToCourseUnitService.repository.save(lessonToCourseUnit)
  }
}
