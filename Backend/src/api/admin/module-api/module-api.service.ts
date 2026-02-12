import { BadRequestException, Injectable } from '@nestjs/common'

import { SchoolService } from '@/modules/core/school/school.service'
import { UserService } from '@/modules/core/user/user.service'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { CourseUnitService } from '../../../modules/core/course-unit/course-unit.service'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseUnitSearchOptions } from './dtos/module-unit-search-options.dto'

@Injectable()
export class ModuleUnitAdminApiService {
  constructor(
    private courseUnitService: CourseUnitService,
    private schoolService: SchoolService,
    private userService: UserService,
  ) {}

  async getCourseUnitList(
    userId: string,
    dto: CourseUnitSearchOptions,
    school_id: string,
  ): Promise<PageDto<CourseUnit>> {
    const user = await this.userService.findOne({ where: { id: userId } })

    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    const school = await this.schoolService.findOne({
      where: { id: school_id },
    })

    if (!school) {
      throw new BadRequestException(`No school found with ID ${school_id}`)
    }

    return await this.courseUnitService.getList(dto, school_id)
  }

  async getOwnCourseUnitList(
    userId: string,
    dto: CourseUnitSearchOptions,
  ): Promise<PageDto<CourseUnit>> {
    const user = await this.userService.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }
    return await this.courseUnitService.getListByUserId(userId, dto)
  }
}
