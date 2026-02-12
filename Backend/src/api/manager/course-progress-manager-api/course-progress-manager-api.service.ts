import { Injectable } from '@nestjs/common'

import { CourseProgress } from '../../../modules/core/course-progress/course-progress.entity'
import { Course } from '../../../modules/core/course/course.entity'
import { CourseProgressManagerService } from '../../../modules/managers/course-progress-manager/course-progress-manager.service'
import { PageDto } from '../../../utils/dtos/page.dto'
import { ClassSearchOptions } from '../school-class-manager-api/dtos/class-search-option.dto'

@Injectable()
export class CourseProgressManagerApiService {
  constructor(
    private courseProgressManagerService: CourseProgressManagerService,
  ) {}

  async getCourseProgressContent(id: string): Promise<Course> {
    return await this.courseProgressManagerService.getCourseProgressContent(id)
  }

  async getCourseProgressList(
    dto: ClassSearchOptions,
  ): Promise<PageDto<CourseProgress>> {
    return await this.courseProgressManagerService.getList(dto)
  }
}
