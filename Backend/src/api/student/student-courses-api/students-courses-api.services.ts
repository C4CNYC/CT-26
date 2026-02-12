import { Injectable } from '@nestjs/common'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { Course } from '../../../modules/core/course/course.entity'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { StudentCoursesManagerService } from '../../../modules/managers/student-manager/courses-student-manager/courses-student-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { MyCoursesSearchOptions } from './dtos/my-courses-search-options.dto'
import { CourseRatingDto } from './dtos/rating.dto'

@Injectable()
export class StudentCoursesApiService {
  constructor(
    private studentCoursesManagerService: StudentCoursesManagerService,
  ) {}

  async updateRating(
    id: string,
    course_id: string,
    dto: CourseRatingDto,
  ): Promise<MessageDto> {
    await this.studentCoursesManagerService.updateRating(id, course_id, dto)
    return new MessageDto('rating')
  }

  async removeLike(id: string, course_id: string): Promise<MessageDto> {
    await this.studentCoursesManagerService.removeLike(id, course_id)
    return new MessageDto('unliked')
  }
  async addLike(id: string, course_id: string): Promise<MessageDto> {
    await this.studentCoursesManagerService.like(id, course_id)
    return new MessageDto('liked')
  }

  async getCourses(
    student_id: string | undefined,
    dto: MyCoursesSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    return await this.studentCoursesManagerService.getCourses(
      student_id,
      dto,
      org_id,
    )
  }

  async getCourseModules(
    studentID: string,
    course_id: string,
  ): Promise<CourseUnit[]> {
    return await this.studentCoursesManagerService.getCourseModules(
      studentID,
      course_id,
    )
  }

  async getCourseLessons(
    studentID: string,
    module_id: string,
  ): Promise<Lesson[]> {
    return await this.studentCoursesManagerService.getCourseLessons(
      studentID,
      module_id,
    )
  }

  async getCourse(student_id: string, class_id: string): Promise<Course> {
    return await this.studentCoursesManagerService.getCourse(
      student_id,
      class_id,
    )
  }

  async getCourseContent(
    student_id: string | undefined,
    class_id: string,
  ): Promise<Course> {
    return await this.studentCoursesManagerService.getCourseContent(
      student_id,
      class_id,
    )
  }
}
