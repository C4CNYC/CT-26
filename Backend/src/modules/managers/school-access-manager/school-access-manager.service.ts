import { Injectable } from '@nestjs/common'

import { SchoolService } from '../../core/school/school.service'
import { Role } from '../../core/user/enums/role.enum'
import { UserService } from '../../core/user/user.service'

@Injectable()
export class SchoolAccessManagerService {
  constructor(
    private userService: UserService,
    private schoolService: SchoolService,
  ) {}

  async canUserManageSchool(
    user_id: string,
    school_id: string,
  ): Promise<boolean> {
    if (!user_id || !school_id) return false
    const [user, school] = await Promise.all([
      this.userService.findOne({
        where: { id: user_id },
        relations: { organization: true, schools: true },
      }),
      this.schoolService.findOne({
        where: { id: school_id },
        relations: { organization: true },
      }),
    ])
    if (!user || !school) return false
    if (user.role === Role.SuperAdmin) return true
    const same_organization = Boolean(
      user.organization &&
        school.organization &&
        user.organization.id === school.organization.id,
    )
    return (
      same_organization &&
      (user.role === Role.Owner ||
        user.role === Role.Admin ||
        user.schools.some((teacher_school) => teacher_school.id === school_id))
    )
  }
}
