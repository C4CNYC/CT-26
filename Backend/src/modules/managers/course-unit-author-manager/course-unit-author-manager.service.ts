import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsRelations } from 'typeorm'

import { CreateUnitAuthorDto } from '../../../api/manager/course-unit-author-manager-api/dtos/create-unit-author.dto'
import { UnitAuthorSearchOptions } from '../../../api/manager/course-unit-author-manager-api/dtos/unit-author-search-option.dto'
import { UpdateUnitAuthorDto } from '../../../api/manager/course-unit-author-manager-api/dtos/update-unit-author.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseUnitAuthor } from '../../core/course-unit-authors/course-unit-authors.entity'
import { CourseUnitAuthorService } from '../../core/course-unit-authors/course-unit-authors.service'
import { CourseUnit } from '../../core/course-unit/course-unit.entity'
import { CourseUnitService } from '../../core/course-unit/course-unit.service'

@Injectable()
export class CourseUnitAuthorManagerService {
  constructor(
    private courseUnitService: CourseUnitService,
    private courseUnitAuthorService: CourseUnitAuthorService,
  ) {}

  async getList(
    dto: UnitAuthorSearchOptions,
  ): Promise<PageDto<CourseUnitAuthor>> {
    return await this.courseUnitAuthorService.getList(dto)
  }

  async getCourseUnitAuthor(
    id: string,
    relations?: FindOptionsRelations<CourseUnit>,
  ): Promise<CourseUnitAuthor> {
    const courseUnit = await this.courseUnitAuthorService.findOne({
      where: { id },
      relations,
    })
    if (!courseUnit) throw new NotFoundException("course unit doesn't exist")
    return courseUnit
  }

  async create({
    course_unit_id,
    ...dto
  }: CreateUnitAuthorDto): Promise<CourseUnitAuthor> {
    const course_unit = await this.courseUnitService.findOne({
      where: { id: course_unit_id },
    })

    if (!course_unit) {
      throw new NotFoundException("course doesn't exist")
    }

    const courseUnitAuthor = await this.courseUnitAuthorService.create({
      ...dto,
      course_unit,
    })

    return courseUnitAuthor
  }

  async updateAvatar(id: string, dto: { avatar: string }): Promise<void> {
    await this.courseUnitAuthorService.update(id, dto)
  }

  async update(id: string, dto: UpdateUnitAuthorDto): Promise<void> {
    const courseUnitAuthor = await this.courseUnitAuthorService.findOne({
      where: { id },
    })
    if (!courseUnitAuthor)
      throw new NotFoundException("course unit author doesn't exist")

    await this.courseUnitAuthorService.update(id, dto)
  }

  async remove(id: string): Promise<void> {
    await this.courseUnitAuthorService.remove(id)
  }
}
