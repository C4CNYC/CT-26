import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { LogActivityManagerService } from '@/api/manager/logactivity-manager/logactivity.service'
import { AuthGoogleRequestDto } from '@/api/old-auth/dtos/auth-google.dto'
import { LogActivityCategory } from '@/modules/core/log-activity/log-activity.entity'
import { AuthService } from '@/old-auth/auth.service'
import { LoginedUser } from '@/old-auth/interfaces/logined-user.interface'
import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { GoogleAuthService } from '../../../providers/google-auth/google-auth.service'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { StudentService } from '../../core/student/student.service'
import { User } from '../../core/user/user.entity'
import { UserService } from '../../core/user/user.service'
import { ApplicationEventEnum } from '../users-manager/enums/application-event'

import path = require('path')

@Injectable()
export class AuthGoogleManagerService {
  constructor(
    private s3Service: S3Service,
    private authService: AuthService,
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    private studentService: StudentService,
    private googleAuthService: GoogleAuthService,
    private logActivity: LogActivityManagerService,
  ) {}

  async login(dto: AuthGoogleRequestDto): Promise<LoginedUser> {
    const { email } = await this.googleAuthService.authenticate(dto.code)

    const user = await this.userService.findOne({
      where: { email },
      relations: { student_profile: true },
    })

    await this.logActivity.logActivity(
      LogActivityCategory.USER,
      'AuthGoogleManagerService.login',
      {
        tenant: user?.organization?.id,
        userid: user?.id,
        email,
      },
      user ? 'user exists' : 'user not exists',
    )
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.authService.buildAuthorizedResponse(user)
  }

  async register(dto: AuthGoogleRequestDto): Promise<User> {
    const userInfo = await this.googleAuthService.authenticate(dto.code)

    const user = await this.userService.findOne({
      where: { email: userInfo.email },
    })

    await this.logActivity.logActivity(
      LogActivityCategory.USER,
      'AuthGoogleManagerService.register',
      {
        tenant: user?.organization?.id,
        userid: user?.id,
        email: userInfo.email,
      },
      user ? 'user exists' : 'user not exists',
    )
    if (user) {
      throw new ConflictException('This email is already registered.')
    }

    const studentProfile = await this.studentService.create({
      username: userInfo.name,
      first_name: userInfo.given_name,
      last_name: userInfo.family_name,
      avatar: userInfo.picture,
    })

    const newUser = await this.userService.create({
      email: userInfo.email,
      student_profile: studentProfile,
      role: dto.role,
      avatar: userInfo.picture,
      first_name: userInfo.given_name,
      last_name: userInfo.family_name,
      verified: userInfo.email_verified,
      username: userInfo.name,
    })

    return newUser
  }

  async updateAvatar(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const user = await this.userService.findOne({ where: { id } })
    const old_file_path = `${TENANT_PATH_BUILDER.users(org_id)}/${user.id}/avatar${path.basename(user.avatar || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.users(org_id)}/${user.id}/${Date.now()}_avatar${path.extname(originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.userService.update(id, { avatar })
    if (user.avatar)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('avatar updated')
  }
}
