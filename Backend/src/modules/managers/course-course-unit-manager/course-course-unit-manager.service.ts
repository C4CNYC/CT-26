import { Injectable, NotFoundException } from '@nestjs/common'

import { AddModuleToCourseDto } from '../../../api/manager/course-manager-api/dtos/add-module-to-course.dto'
import { RemoveModuleFromCourseDto } from '../../../api/manager/course-manager-api/dtos/remove-module-from-course.dto'
import { CourseUnitService } from '../../core/course-unit/course-unit.service'
import { CourseService } from '../../core/course/course.service'

@Injectable()
export class CourseCourseUnitManagerService {
  constructor(
    private courseUnitService: CourseUnitService,
    private courseService: CourseService,
  ) {}

  async addUnitToCourse(id: string, dto: AddModuleToCourseDto): Promise<void> {
    const course = await this.courseService.findOne({
      where: { id },
      relations: { units: true },
    })
    if (!course) throw new NotFoundException("course doesn't exist")

    const unit = await this.courseUnitService.findOne({
      where: { id: dto.unit_id },
    })
    if (!unit) throw new NotFoundException("module doesn't exist")

    course.units.push(unit)
    await this.courseService.repository.save(course)
  }

  async removeUnitFromCourse(
    id: string,
    dto: RemoveModuleFromCourseDto,
  ): Promise<void> {
    const course = await this.courseService.findOne({
      where: { id },
      relations: { units: true },
    })
    if (!course) throw new NotFoundException("course doesn't exist")

    course.units = course.units.filter((l) => l.id !== dto.unit_id)
    await this.courseService.repository.save(course)
  }
}
