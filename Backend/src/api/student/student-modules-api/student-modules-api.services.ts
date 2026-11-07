import { Injectable } from '@nestjs/common'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { CourseUnitManagerService } from '../../../modules/managers/course-unit-manager/course-unit-manager.service'

@Injectable()
export class StudentModulesApiService {
  constructor(private courseUnitManagerModule: CourseUnitManagerService) {}

  async getModule(id: string, studentId: string): Promise<CourseUnit> {
    return await this.courseUnitManagerModule.getCourseUnit(
      id,
      true,
      undefined,
      studentId,
    )
  }

  async getPublicModule(id: string): Promise<CourseUnit> {
    return await this.courseUnitManagerModule.getPublicCourseUnit(id, true)
  }
}
