import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { SchoolService } from '../../../modules/core/school/school.service'
import { SchoolMangerService } from '../../../modules/managers/school-manager/school-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'

import path = require('path')

@Injectable()
export class SchoolManagerApiService {
  constructor(
    private schoolManagerService: SchoolMangerService,
    private schoolService: SchoolService,
    private eventEmitter: EventEmitter2,
    private s3Service: S3Service,
  ) {}

  async updateAvatar(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const school = await this.schoolManagerService.getSchool(id)
    const old_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${path.basename(school.avatar || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${Date.now()}_avatar${path.extname(originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.schoolService.update(id, { avatar })
    if (school.avatar)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('avatar updated')
  }

  async updateCover(
    id: string,
    file: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const school = await this.schoolManagerService.getSchool(id)
    const old_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${path.basename(school.cover || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${Date.now()}_cover${path.extname(file.originalname)}`
    const cover = await this.s3Service.uploadFile(new_file_path, file.buffer)

    await this.schoolService.update(id, { cover })
    if (school.cover)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('avatar updated')
  }
}
