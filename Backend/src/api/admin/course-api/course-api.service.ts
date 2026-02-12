import { Injectable } from '@nestjs/common'

import { CatalogCourseService } from '@/modules/core/catalog-course/catalog-course.service'

import { ClassSearchOptions } from '../../../api/manager/school-class-manager-api/dtos/class-search-option.dto'
import { Course } from '../../../modules/core/course/course.entity'
import { CourseService } from '../../../modules/core/course/course.service'
import { PageDto } from '../../../utils/dtos/page.dto'

@Injectable()
export class CourseApiService {
  constructor(
    private courseService: CourseService,
    private catalogCourseService: CatalogCourseService,
  ) {}

  async getList(
    dto: ClassSearchOptions,
    school_id: string,
  ): Promise<PageDto<Course>> {
    return await this.courseService.getList(dto, school_id)
  }

  async getListFromCatalog(
    dto: ClassSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    return await this.catalogCourseService.getOwnCatalogCoursesForOrg(
      dto,
      org_id,
    )
  }

  async getListGlobalCoursesFromCatalogByOrg(
    dto: ClassSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    return await this.catalogCourseService.getGlobalCatalogCoursesForOrg(
      dto,
      org_id,
    )
  }

  async updateAdminGlobalCourseInCatalogByOrg(
    org_id: string,
    course_id: string,
    is_show: boolean = false,
  ): Promise<void> {
    return await this.catalogCourseService.setGlobalCourseVisibility(
      org_id,
      course_id,
      is_show,
    )
  }

  async getOwnList(dto: ClassSearchOptions): Promise<PageDto<Course>> {
    return await this.courseService.findOwnCourses(dto)
  }
}
