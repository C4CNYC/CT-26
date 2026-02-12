import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindOptionsRelations } from 'typeorm'

import { OrganizationService } from '@/modules/core/organization/organization.service'
import { SchoolService } from '@/modules/core/school/school.service'
import { Role } from '@/modules/core/user/enums/role.enum'
import { UserService } from '@/modules/core/user/user.service'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { CreateCourseDto } from '../../../api/manager/course-manager-api/dtos/create-course.dto'
import { UpdateCoursetDto } from '../../../api/manager/course-manager-api/dtos/update-course.dto'
import { ClassSearchOptions } from '../../../api/manager/school-class-manager-api/dtos/class-search-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CatalogCourseService } from '../../core/catalog-course/catalog-course.service'
import { Course } from '../../core/course/course.entity'
import { CourseService } from '../../core/course/course.service'

@Injectable()
export class CourseManagerService {
  constructor(
    private schoolService: SchoolService,
    private courseService: CourseService,
    private userService: UserService,
    private catalogCourseService: CatalogCourseService,
    private organizationService: OrganizationService,
  ) {}

  async getList(
    dto: ClassSearchOptions,
    request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    const { user } = request
    if (user.role === Role.Manager) {
      dto.user_id = user.id
    }
    return await this.courseService.getList(dto, request.school_id)
  }

  async getCatalogList(dto: ClassSearchOptions): Promise<PageDto<Course>> {
    return await this.courseService.findCatalogCourses(dto)
  }

  async getOwnList(
    dto: ClassSearchOptions,
    request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    const { user } = request
    if (user) {
      dto.user_id = user.id
    }
    return await this.courseService.findOwnCourses(dto)
  }

  async getPublicList(
    dto: ClassSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    return await this.catalogCourseService.getPublicCatalogCoursesForOrg(
      dto,
      org_id,
    )
  }

  async getCourse(
    id: string,
    relations?: FindOptionsRelations<Course>,
    lessonCondition: boolean = true,
  ): Promise<Course> {
    const optionalCondition = lessonCondition
      ? {
          units: {
            active: true,
            lessons: {
              active: true,
            },
          },
        }
      : {}
    const course = await this.courseService.findOne({
      where: {
        id,
        active: true,
        ...optionalCondition,
      },
      relations,
    })
    if (!course) throw new NotFoundException("course doesn't exist")
    return course
  }

  async create(
    dto: CreateCourseDto,
    request: RequestWithMeta,
  ): Promise<Course> {
    const { content_id } = dto
    const duplicateCourse = await this.courseService.findOne({
      where: { content_id },
    })
    if (duplicateCourse)
      throw new ConflictException(
        'course with this content id is already exist',
      )
    const { role, id: userId } = request.user
    const { org_id, school_id } = request
    const user =
      role === Role.Manager
        ? await this.userService.findOne({
            where: { id: userId },
          })
        : {}

    let school = null
    if (school_id) {
      school = await this.schoolService.findOne({ where: { id: school_id } })
      if (!school) throw new NotFoundException('School not found')
    }

    let course: Course
    if (role === Role.Owner) {
      course = await this.courseService.create({
        ...dto,
        userId,
        schools: school ? [school] : [],
      })
    } else {
      course = await this.courseService.create({
        ...dto,
        user,
        userId,
        schools: school ? [school] : [],
      })
    }

    if (org_id && course?.id) {
      await this.catalogCourseService.create({
        organization_id: org_id,
        course_id: course.id,
        is_show: true,
      })
    }

    return course
  }

  async updateCover(id: string, dto: { cover: string }): Promise<void> {
    await this.courseService.update(id, dto)
  }

  async update(
    id: string,
    dto: UpdateCoursetDto,
    org_id: string,
  ): Promise<void> {
    const course = await this.courseService.findOne({ where: { id } })
    if (!course) throw new NotFoundException("course doesn't exist")

    await this.courseService.update(id, dto)

    if (dto.is_global === true) {
      const allOrgs = await this.organizationService.find({})
      for (const org of allOrgs) {
        const exists = await this.catalogCourseService.findOne({
          where: { organization_id: org.id, course_id: id },
        })
        if (!exists) {
          await this.catalogCourseService.create({
            organization_id: org.id,
            course_id: id,
            is_show: true,
          })
        }
      }
    } else if (dto.is_global === false) {
      await this.catalogCourseService.repository
        .createQueryBuilder()
        .delete()
        .where('course_id = :course_id', { course_id: id })
        .andWhere('organization_id != :owner_org_id', {
          owner_org_id: org_id,
        })
        .execute()
    }
  }

  async remove(id: string): Promise<void> {
    await this.courseService.remove(id)
  }
}
