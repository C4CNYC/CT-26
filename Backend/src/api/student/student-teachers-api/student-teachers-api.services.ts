import { Injectable } from '@nestjs/common'

import { User } from '../../../modules/core/user/user.entity'
import { UsersManagerService } from '../../../modules/managers/users-manager/users-managers.service'

@Injectable()
export class StudentTeachersApiService {
  constructor(private usersManagerService: UsersManagerService) {}

  async getMyTeachers(): Promise<User[]> {
    return await Promise.resolve([])
  }
}
