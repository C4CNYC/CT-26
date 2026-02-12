import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsRelations } from 'typeorm'

import { CourseAuthorSearchOptions } from '../../../api/manager/course-author-manager-api/dtos/course-author-search-option.dto'
import { CreateCourseAuthorDto } from '../../../api/manager/course-author-manager-api/dtos/create-course-author.dto'
import { UpdateCourseAuthorDto } from '../../../api/manager/course-author-manager-api/dtos/update-course-author.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseAuthor } from '../../core/course-authors/course-authors.entity'
import { CourseAuthorService } from '../../core/course-authors/course-authors.service'
import { Course } from '../../core/course/course.entity'
import { CourseService } from '../../core/course/course.service'

@Injectable()
export class CourseAuthorManagerService {
  constructor(
    private courseService: CourseService,
    private courseAuthorService: CourseAuthorService,
  ) {}

  async getList(
    dto: CourseAuthorSearchOptions,
  ): Promise<PageDto<CourseAuthor>> {
    return await this.courseAuthorService.getList(dto)
  }

  async getCourseAuthor(
    id: string,
    relations?: FindOptionsRelations<Course>,
  ): Promise<CourseAuthor> {
    const course = await this.courseAuthorService.findOne({
      where: { id },
      relations,
    })
    if (!course) throw new NotFoundException("course doesn't exist")
    return course
  }

  async create({
    course_id,
    ...dto
  }: CreateCourseAuthorDto): Promise<CourseAuthor> {
    const course = await this.courseService.findOne({
      where: { id: course_id },
    })

    if (!course) {
      throw new NotFoundException("course doesn't exist")
    }

    const courseAuthor = await this.courseAuthorService.create({
      ...dto,
      course,
    })

    return courseAuthor
  }

  async updateAvatar(id: string, dto: { avatar: string }): Promise<void> {
    await this.courseAuthorService.update(id, dto)
  }

  async update(id: string, dto: UpdateCourseAuthorDto): Promise<void> {
    const courseAuthor = await this.courseAuthorService.findOne({
      where: { id },
    })
    if (!courseAuthor)
      throw new NotFoundException("course author doesn't exist")

    await this.courseAuthorService.update(id, dto)
  }

  async remove(id: string): Promise<void> {
    await this.courseAuthorService.remove(id)
  }
}
