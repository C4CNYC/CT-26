import { ForbiddenException, Injectable } from '@nestjs/common'

import { Lesson } from '../../../modules/core/lesson/lesson.entity'
import { LessonService } from '../../../modules/core/lesson/lesson.service'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { UserService } from '../../../modules/core/user/user.service'
import { PageDto } from '../../../utils/dtos/page.dto'
import { LessonSearchOptions } from './dtos/lesson-search-option.dto'

@Injectable()
export class LessonApiService {
  constructor(
    private lessonService: LessonService,
    private userService: UserService,
  ) {}

  async getLessons(dto: LessonSearchOptions): Promise<PageDto<Lesson>> {
    return await this.lessonService.getList(dto)
  }

  async getAdminLessons(
    userId: string,
    dto: LessonSearchOptions,
    school_id: string,
  ): Promise<PageDto<Lesson>> {
    const user = await this.userService.findOne({ where: { id: userId } })

    if (!user || user.role == Role.Student)
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      )

    let list: PageDto<Lesson>
    switch (user.role) {
      case Role.Admin:
      case Role.SuperAdmin:
        list = await this.lessonService.getList(dto, school_id)
        break
      default:
        list = await this.lessonService.getListByUserId(user.id, dto, school_id)
        break
    }
    return list
  }
}
