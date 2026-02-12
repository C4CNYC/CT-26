import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindOptionsRelations } from 'typeorm'

import { SchoolService } from '@/modules/core/school/school.service'
import { UserService } from '@/modules/core/user/user.service'

import { CourseUnitSearchOptions } from '../../../api/manager/course-unit-manager-api/dtos/course-unit-search-option.dto'
import { CreateCourseUnitDto } from '../../../api/manager/course-unit-manager-api/dtos/create-course-unit.dto'
import { UpdateCourseUnitDto } from '../../../api/manager/course-unit-manager-api/dtos/update-course-unit.dto'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseUnit } from '../../core/course-unit/course-unit.entity'
import { CourseUnitService } from '../../core/course-unit/course-unit.service'
import { CourseService } from '../../core/course/course.service'

@Injectable()
export class CourseUnitManagerService {
  constructor(
    private courseService: CourseService,
    private schoolService: SchoolService,
    private courseUnitService: CourseUnitService,
    private userService: UserService,
  ) {}

  async getList(
    userId: string,
    dto: CourseUnitSearchOptions,
  ): Promise<PageDto<CourseUnit>> {
    const user = await this.userService.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    return await this.courseUnitService.getListByUserId(userId, dto)
  }

  async getCatalogList(
    userId: string,
    dto: CourseUnitSearchOptions,
    school_id: string,
  ): Promise<PageDto<CourseUnit>> {
    const user = await this.userService.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    const { data: courses } = await this.courseService.findCatalogCourses(dto)
    const courseUnits = await Promise.all(
      courses.map(async (course) => {
        try {
          const { data: courseUnitList } = await this.courseUnitService.getList(
            {
              ...dto,
              course_id: course.id,
            } as CourseUnitSearchOptions,
            school_id,
          )
          return courseUnitList
        } catch {
          return await new Promise((resolve) => resolve(null))
        }
      }, []),
    )

    const flattenedCourseUnits = courseUnits.flat()

    return new PageDto(
      flattenedCourseUnits as CourseUnit[],
      new PageMetaDto({ page_options_dto: dto, item_count: courses.length }),
    )
  }

  async getCourseUnit(
    id: string,
    onlyActiveWithLessons: boolean,
    relations?: FindOptionsRelations<CourseUnit>,
    studentId?: string,
  ): Promise<CourseUnit> {
    let unit
    if (onlyActiveWithLessons) {
      unit = await this.courseUnitService.getCourseUnit(id, studentId)
      unit.lessons = unit.lessons.filter((lesson) => lesson.active)
    } else {
      unit = await this.courseUnitService.findOne({
        where: { id },
        relations,
      })
    }
    if (!unit) throw new NotFoundException("module doesn't exist")
    return unit
  }

  async getPublicCourseUnit(
    id: string,
    onlyActiveWithLessons: boolean,
    relations?: FindOptionsRelations<CourseUnit>,
  ): Promise<CourseUnit> {
    let unit: CourseUnit
    if (onlyActiveWithLessons) {
      unit = await this.courseUnitService.getCourseUnit(id)
    } else {
      unit = await this.courseUnitService.findOne({
        where: { id },
        relations,
      })
    }
    if (!unit) throw new NotFoundException("module doesn't exist")
    unit.lessons = unit.lessons.filter((lesson) => lesson.active)
    return unit
  }

  async create(
    userId: string,
    dto: CreateCourseUnitDto,
    school_id: string,
  ): Promise<CourseUnit> {
    const user = await this.userService.findOne({ where: { id: userId } })
    const school = await this.schoolService.findOne({
      where: { id: school_id },
    })

    const courseUnit = new CourseUnit()
    courseUnit.name = dto.name
    courseUnit.description = dto.description
    courseUnit.initial_enrolled = dto.initial_enrolled
    courseUnit.initial_likes = dto.initial_likes
    courseUnit.initial_stars = dto.initial_stars
    courseUnit.user = user
    courseUnit.school = school

    return await this.courseUnitService.create(courseUnit)
  }

  async update(id: string, dto: UpdateCourseUnitDto): Promise<void> {
    const unit = await this.courseUnitService.findOne({ where: { id } })
    if (!unit) throw new NotFoundException("module doesn't exist")
    await this.courseUnitService.update(id, dto)
  }

  async updateAvatar(id: string, dto: { avatar: string }): Promise<void> {
    await this.courseUnitService.update(id, dto)
  }

  async updateBackground(
    id: string,
    dto: { background: string },
  ): Promise<void> {
    await this.courseUnitService.update(id, dto)
  }

  async remove(id: string): Promise<void> {
    await this.courseUnitService.remove(id)
  }
}
