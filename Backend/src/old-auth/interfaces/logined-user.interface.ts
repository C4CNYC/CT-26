import { User } from '../../modules/core/user/user.entity'

export interface LoginedUser {
  user: User
  access_token: string
}
