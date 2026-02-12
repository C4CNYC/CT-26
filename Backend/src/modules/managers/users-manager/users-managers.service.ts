import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { omit } from 'lodash'
import * as uniqueNamesGenerator from 'unique-names-generator'

import { SignupRequestDto } from '@/api/old-auth/dtos/signup-request.dto'
import { Organization } from '@/modules/core/organization/organization.entity'
import { AuthPasswordsService } from '@/old-auth/auth-password.service'

import { CreateMemberDto } from '../../../api/admin/user-api/dtos/create-member.dto'
import { UpdateMemberDto } from '../../../api/admin/user-api/dtos/update-member.dto'
import { UserOptionDto } from '../../../api/admin/user-api/dtos/user-options.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { OrganizationService } from '../../core/organization/organization.service'
import { StudentService } from '../../core/student/student.service'
import { User } from '../../core/user/user.entity'
import { UserService } from '../../core/user/user.service'

import _ = require('lodash')

@Injectable()
export class UsersManagerService {
  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private passwordService: AuthPasswordsService,
    private organizationService: OrganizationService,
  ) {}

  async createUser(
    { password, ...dto }: SignupRequestDto,
    organization?: Organization,
  ): Promise<User> {
    const username = await this.generateRandomUsername()

    const student_profile = await this.studentService.create({
      ...omit(dto, ['email', 'role', 'password']),
      username: username,
    })
    const hash = await this.passwordService.getHashedPassword(password)

    return await this.userService.create({
      ...dto,
      avatar: dto.emojiAvatar,
      password: hash,
      verified: true,
      student_profile,
      username: username,
      organization,
    })
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userService.findOne({ where: { id } })
    if (!user) throw new NotFoundException(`user doesn't exist`)
    return user
  }

  async updateOrgMember(
    id: string,
    dto: UpdateMemberDto | { avatar: string },
  ): Promise<void> {
    await this.userService.update(id, dto)
  }

  async createUserWithoutPassword(dto: CreateMemberDto, org_id?: string): Promise<User> {
    const user = await this.userService.findOne({
      where: { email: dto.email },
    })
    if (user) throw new ConflictException(`${dto.email} already exist`)
    const student_profile = await this.studentService.create(
      _.omit(dto, ['email']),
    )
    let organization
    if (org_id) {
      organization = await this.organizationService.findOne({
        where: { id: org_id },
      })
    }
    return await this.userService.create({
      ...dto,
      student_profile,
      organization,
    })
  }

  async updatePassword(user_id: string, password: string): Promise<void> {
    const hash = await this.passwordService.getHashedPassword(password)
    await this.userService.update(user_id, { password: hash, verified: true })
  }

  async getUsers(dto: UserOptionDto): Promise<PageDto<User>> {
    return await this.userService.getUsers(dto)
  }

  async deleteAccount(id: string): Promise<void> {
    await this.userService.remove(id)
  }

  async updateMetaFlag(
    id: string,
    key: string,
    value: string | number | boolean,
  ): Promise<void> {
    await this.userService.updateMetaFlag(id, key, value)
  }

  private async generateRandomUsername(): Promise<string> {
    const random_user_name = `${uniqueNamesGenerator.uniqueNamesGenerator({
      dictionaries: [
        uniqueNamesGenerator.adjectives,
        uniqueNamesGenerator.animals,
      ],
      separator: '',
      length: 2,
      style: 'capital',
    })}${_.random(10, 99)}`

    const is_name_already_taken = await this.userService.findOne({
      where: {
        username: random_user_name,
      },
    })

    if (is_name_already_taken) {
      return await this.generateRandomUsername()
    }

    return random_user_name
  }
}
