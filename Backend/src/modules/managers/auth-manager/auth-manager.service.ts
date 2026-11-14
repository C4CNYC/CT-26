import { ConflictException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { LogActivityManagerService } from '@/api/manager/logactivity-manager/logactivity.service'
import { ResetPasswordDto } from '@/api/old-auth/dtos/reset-password.dto'
import { SignigRequestDto } from '@/api/old-auth/dtos/signin-request.dto'
import { SignupRequestDto } from '@/api/old-auth/dtos/signup-request.dto'
import { UpdateProfileDto } from '@/api/old-auth/dtos/update-profile.dto'
import { LogActivityCategory } from '@/modules/core/log-activity/log-activity.entity'
import { OrganizationService } from '@/modules/core/organization/organization.service'
import { AuthPasswordsService } from '@/old-auth/auth-password.service'
import { AuthService } from '@/old-auth/auth.service'
import { LoginedUser } from '@/old-auth/interfaces/logined-user.interface'
import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { UpdateMetaFlagDto } from '../../../api/old-auth/dtos/update-meta-flag.dto'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { Role } from '../../core/user/enums/role.enum'
import { User } from '../../core/user/user.entity'
import { UserService } from '../../core/user/user.service'
import { TeacherSchoolSetupService } from '../school-manager/teacher-school-setup.service'
import { UserResetPasswordManagerService } from '../user-reset-password-manager/user-reset-password-manager.service'
import { ApplicationEventEnum } from '../users-manager/enums/application-event'
import { UsersManagerService } from '../users-manager/users-managers.service'

import path = require('path')

@Injectable()
export class AuthManagerService {
    constructor(
    private userService: UserService,
    private authService: AuthService,
    private organizationService: OrganizationService,
    private authPasswordService: AuthPasswordsService,
    private eventEmitter: EventEmitter2,
    private s3Service: S3Service,
    private userResetPassword: UserResetPasswordManagerService,
    private usersManagerService: UsersManagerService,
    private logActivity: LogActivityManagerService,
    private teacherSchoolSetup: TeacherSchoolSetupService,
  ) {}

  async login(dto: SignigRequestDto, org_id: string): Promise<LoginedUser> {
    const user = await this.userService.findOne({
      where: { email: dto.email },
      relations: { organization: true },
    })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.logActivity.logActivity(
      LogActivityCategory.USER,
      'AuthManagerService.login',
      {
        tenant: org_id,
        userid: user ? user.id : undefined,
        email: dto.email,
      },
      user ? 'email exists' : 'email not exists',
    )

    if (
      ![Role.SuperAdmin, Role.Student].includes(user?.role) &&
      user.organization.id !== org_id
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.logActivity.logActivity(
        LogActivityCategory.USER,
        'AuthManagerService.login',
        {
          tenant: org_id,
          userid: user ? user.id : undefined,
          email: dto.email,
        },
        'Organization Problem',
        {
          userOrganization: user.organization.id,
          providedOrganization: org_id,
        },
      )
      throw new ConflictException('User is not part of this organization')
    }
    return await this.authService.login(dto.email, dto.password)
  }

  async register(
    dto: SignupRequestDto,
    org_id: string,
    tenant_name: string,
  ): Promise<LoginedUser> {
    const userExists = await this.userService.findOne({
      where: { email: dto.email },
    })

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.logActivity.logActivity(
      LogActivityCategory.USER,
      'AuthManagerService.register',
      {
        tenant: org_id,
        userid: userExists ? userExists.id : undefined,
        email: dto.email,
      },
      userExists ? 'email exists' : 'email not exists',
    )

    if (userExists) {
      return await this.login(dto, org_id)
    }

    const organization = await this.organizationService.findOne({
      where: { id: org_id },
    })

    const user = await this.usersManagerService.createUser(dto, organization)
    if (dto.role !== Role.Student) {
      await this.teacherSchoolSetup.setupTeacherSchool(user, dto.email, org_id)

      this.eventEmitter.emit(
        ApplicationEventEnum.CREATE_ORG,
        user.email,
        tenant_name,
      )
    } else {
      this.eventEmitter.emit(ApplicationEventEnum.CREATE_STUDENT, user.email)
    }
    return this.authService.buildAuthorizedResponse(user)
  }

  async getProfile(dto: User): Promise<User> {
    if (!dto || !dto.id) {
      throw new Error(`User ID missing`)
    }
    return await this.userService.findOne({
      where: { id: dto.id },
      relations: { student_profile: true },
    })
  }

  async resetPassword(
    dto: ResetPasswordDto,
    org_slug: string,
    referrer: string,
  ): Promise<MessageDto> {
    const user = await this.userService.findOne({
      where: { email: dto.email },
    })

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.logActivity.logActivity(
      LogActivityCategory.USER,
      'AuthManagerService.resetPassword',
      {
        tenant: org_slug,
        userid: user ? user.id : undefined,
        email: dto.email,
      },
      user ? 'email exists' : 'email not exists',
      { user },
    )
    if (!user) return new MessageDto('reset email sended')
    const reset = await this.userResetPassword.createResetPassword(user)
    this.eventEmitter.emit(
      ApplicationEventEnum.RESET_STUDENT_PASSWORD,
      user.email,
      reset.id,
      org_slug,
      referrer,
    )
    return new MessageDto('reset password sent')
  }
  async getResetPasswordUser(id: string): Promise<User> {
    return  this.userResetPassword.getResertPasswordUser(id)
  }
  async submitPassword(
    id: string,
    unprotected_password: string,
  ): Promise<MessageDto> {
    const { user } = await this.userResetPassword.getResetPassword(id)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.logActivity.logActivity(
      LogActivityCategory.USER,
      'AuthManagerService.passwordSubmit',
      {
        tenant: user?.organization?.id,
        userid: user ? user.id : undefined,
        email: user?.email,
      },
    )
    const password =
      await this.authPasswordService.getHashedPassword(unprotected_password)
    await this.userService.update(user.id, { password })
    return new MessageDto('password udpated')
  }

  async updateProfile(user: User, dto: UpdateProfileDto): Promise<MessageDto> {
    await this.userService.update(user.id, dto)
    return new MessageDto('profile updated')
  }

  async updateMetaFlag(
    user_id: string,
    dto: UpdateMetaFlagDto,
  ): Promise<MessageDto> {
    await this.usersManagerService.updateMetaFlag(user_id, dto.key, dto.value)
    return new MessageDto('user updated')
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
