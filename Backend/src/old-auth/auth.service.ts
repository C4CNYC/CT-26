import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { User } from '../modules/core/user/user.entity'
import { UserService } from '../modules/core/user/user.service'
import { AuthPasswordsService } from './auth-password.service'
import { LoginedUser } from './interfaces/logined-user.interface'
import { LogActivityManagerService } from '@/api/manager/logactivity-manager/logactivity.service'
import { LogActivityCategory } from '@/modules/core/log-activity/log-activity.entity'

@Injectable()
export class AuthService {
  constructor(
    private authPasswordService: AuthPasswordsService,
    private userService: UserService,
    private jwtService: JwtService,
    private logActivityManagerService: LogActivityManagerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne({
      where: { email },
      relations: { student_profile: true },
    })
    if (
      user &&
      (await this.authPasswordService.comparePasswords(pass, user.password)) &&
      user.active
    ) {
      return user
    }
    return null
  }

  buildAuthorizedResponse(user: User): LoginedUser {
    return {
      user: !user.username
        ? {
            ...user,
            username: (user.first_name +
              user.last_name +
              Math.floor(Math.random() * 99)) as Lowercase<string>,
          }
        : user,
      access_token: this.jwtService.sign({
        userId: user.id,
        studentID: user.student_profile.id,
        email: user.email,
        role: user.role,
      }),
    }
  }

  async login(email: string, pass: string): Promise<LoginedUser> {
    const user = await this.validateUser(email, pass)
    if (!user) {
      this.logActivityManagerService.logActivity(
        LogActivityCategory.USER,
        'AuthService.login',
        {email,},
        'Wrong password',
        {
          password: pass,
        },
      )
      throw new NotFoundException(
        `The email or password you entered is invalid.`,
      )
    } else {
      
      this.logActivityManagerService.logActivity(
        LogActivityCategory.USER,
        'AuthService.login',
        { email },
        'Successful login'
      )
    }
    return this.buildAuthorizedResponse(user)
  }
}
