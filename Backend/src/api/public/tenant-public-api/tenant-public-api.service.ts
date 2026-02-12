import { Injectable } from '@nestjs/common'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'
 
import { User } from '../../../modules/core/user/user.entity'
import { UsersManagerService } from '../../../modules/managers/users-manager/users-managers.service'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto' 

import path = require('path')
import { CreateMemberDto } from '@/api/admin/user-api/dtos/create-member.dto'

@Injectable()
export class TenantPublicApiService {
  constructor(
    private usersManagerService: UsersManagerService, 
    private s3Service: S3Service, 
  ) { }
  async createMember(dto: CreateMemberDto): Promise<User> {
    return await this.usersManagerService.createUserWithoutPassword(dto)
  }
  
  async updateAvatar(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string, 
  ): Promise<MessageDto> {
    const new_file_path = `${TENANT_PATH_BUILDER.users(org_id)}/${id}${path.extname(originalname)}`
    const new_file_location = await this.s3Service.uploadFile(new_file_path, buffer)

    return new MessageDto( new_file_location )
  }
}