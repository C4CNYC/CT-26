import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { Order } from '@/utils/constants/order.enum'

import { Course } from '../../../modules/core/course/course.entity'
import { CourseService } from '../../../modules/core/course/course.service'
import { LessonContent } from '../../../modules/core/lesson-content/lesson-content.entity'
import { LessonContentService } from '../../../modules/core/lesson-content/lesson-content.service'
import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { LessonService } from '../../../modules/core/lesson/lesson.service'
import { StudentProject } from '../../../modules/core/student-project/student-project.entity'
import { StudentCoursesManagerService } from '../../../modules/managers/student-manager/courses-student-manager/courses-student-manager.service'
import { StudentProjectManagerService } from '../../../modules/managers/student-project-manager/student-project-manager.service'
import { PageDto } from '../../../utils/dtos/page.dto'
import { MyCoursesSearchOptions } from './dtos/my-courses-search-options.dto'

@Injectable()
export class StudentPublicApiService {
  constructor(
    private courseService: CourseService,
    private lessonService: LessonService,
    private lessonContentService: LessonContentService,
    private courseManagerServiceStudent: StudentCoursesManagerService,
    private projectManagerService: StudentProjectManagerService,
  ) {}

  async getProject(id: string): Promise<StudentProject> {
    return await this.projectManagerService.getProject(id)
  }

  async getCourses(
    dto: MyCoursesSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerServiceStudent.getCourses(
      undefined,
      dto,
      org_id,
    )
  }

  async getCourseContent(id: string): Promise<Course> {
    return await this.courseService.getCourseSortedContent(id)
  }

  async getModuleContentList(module_id: string): Promise<Course> {
    return await this.courseService.getModuleWithoutContentsInEachLesson(
      module_id,
    )
  }

  async getLesson(course_id: string, lesson_id: string): Promise<Lesson> {
    const course = await this.courseService.findOne({
      where: { id: course_id },
    })
    if (!course) throw new NotFoundException("course doesn't exist")
    if (!course.public) throw new UnauthorizedException('course is private')
    return await this.lessonService.findOne({
      where: { id: lesson_id },
      relations: { integrations: true },
    })
  }

  getPublicLessonFromSlug(
    dto: { slug: string }, //LessonSearchOptions,
  ): Promise<PageDto<Lesson>> {
    return this.lessonService.getList({
      slug: dto.slug,
      take: 10,
      order: Order.ASC,
      page: 0,
      skip: 0,
    })
  }

  async getLessonContentList(
    course_id: string,
    lesson_id: string,
  ): Promise<LessonContent[]> {
    const course = await this.courseService.findOne({
      where: { id: course_id },
    })
    if (!course) throw new NotFoundException("course doesn't exist")
    if (!course.public) throw new UnauthorizedException('course is private')
    return await this.lessonContentService.find(
      { lesson: { id: lesson_id } },
      { validations: true },
    )
  }
}
