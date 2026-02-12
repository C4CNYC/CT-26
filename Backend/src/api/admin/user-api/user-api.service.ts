import { ForbiddenException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { Role } from '../../../modules/core/user/enums/role.enum'
import { User } from '../../../modules/core/user/user.entity'
import { InvitationsManagerService } from '../../../modules/managers/invitations-manager/invitations-manager.service'
import { ApplicationEventEnum as Event } from '../../../modules/managers/users-manager/enums/application-event'
import { UsersManagerService } from '../../../modules/managers/users-manager/users-managers.service'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateMemberDto } from './dtos/create-member.dto'
import { SubmiInviteDto } from './dtos/submit-invite.dto'
import { UpdateMemberDto } from './dtos/update-member.dto'
import { UserOptionDto } from './dtos/user-options.dto'

import path = require('path')

@Injectable()
export class UserApiService {
  constructor(
    private usersManagerService: UsersManagerService,
    private inviteManagerService: InvitationsManagerService,
    private s3Service: S3Service,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createMember(dto: CreateMemberDto, org_id?: string): Promise<User> {
    return await this.usersManagerService.createUserWithoutPassword(dto, org_id)
  }

  async updateAvatar(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
    initiator_id: string,
  ): Promise<MessageDto> {
    await this.checkUserPermissionToAction(id, initiator_id)
    const user = await this.usersManagerService.getUser(id)
    const old_file_path = `${TENANT_PATH_BUILDER.users(org_id)}/${path.basename(user.avatar || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.users(org_id)}/${id}${path.extname(originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.usersManagerService.updateOrgMember(id, { avatar })
    if (user.avatar) this.eventEmitter.emit(Event.REMOVE_FILE, old_file_path)
    return new MessageDto('avatar updated')
  }

  async inviteMember(dto: CreateMemberDto, org_id?: string): Promise<User> {
    const user = await this.createMember(dto, org_id)
    const invite = await this.inviteManagerService.createInvitation(user)
    this.eventEmitter.emit(Event.INVITE_USER, user.email, invite.id)
    return user
  }

  async submitInvite(dto: SubmiInviteDto): Promise<MessageDto> {
    const invite = await this.inviteManagerService.getInvitation(dto.inviteId)
    await this.usersManagerService.updatePassword(invite.user.id, dto.password)
    return new MessageDto('invite submited')
  }

  async getMembers(page_options_dto: UserOptionDto): Promise<PageDto<User>> {
    return await this.usersManagerService.getUsers(page_options_dto)
  }

  async getMember(user_id: string): Promise<User> {
    return await this.usersManagerService.getUser(user_id)
  }

  async updateMember(
    user_id: string,
    dto: UpdateMemberDto,
    initiator_id: string,
  ): Promise<MessageDto> {
    await this.checkUserPermissionToAction(user_id, initiator_id)
    await this.usersManagerService.updateOrgMember(user_id, dto)
    return new MessageDto('user updated')
  }

  async deleteMemeber(id: string, initiator_id: string): Promise<MessageDto> {
    await this.checkUserPermissionToAction(id, initiator_id)
    const user = await this.usersManagerService.getUser(id)
    await this.usersManagerService.deleteAccount(id)
    this.eventEmitter.emit(Event.ACCOUNT_REMOVED, user.email)
    return new MessageDto('user deleted')
  }

  async checkUserPermissionToAction(
    user_id: string,
    initiator_id: string,
  ): Promise<void> {
    const user = await this.getMember(user_id)
    const initiator = await this.getMember(initiator_id)
    if (user.role === Role.Owner || user.role === Role.SuperAdmin)
      throw new ForbiddenException("owner can't be updated by anyone")
    if (user.role === Role.Admin && initiator.role === Role.Admin)
      throw new ForbiddenException('admin can be updated only by owner')
  }
}
