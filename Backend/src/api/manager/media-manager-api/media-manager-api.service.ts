import { Injectable } from '@nestjs/common'
import * as path from 'path'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { Media } from '../../../modules/core/media/media.entity'
import { MediaManagerService } from '../../../modules/managers/media-manager/media-manager.service'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateMediaDto } from './dtos/create-media.dto'
import { MediaSearchOptions } from './dtos/media-search-option.dto'
import { UpdateMediaDto } from './dtos/update-media.dto'

@Injectable()
export class MediaManagerApiService {
  constructor(
    private mediaManagerService: MediaManagerService,
    private s3Service: S3Service,
  ) {}

  async getMediaList(
    dto: MediaSearchOptions,
    user_id: string,
  ): Promise<PageDto<Media>> {
    return await this.mediaManagerService.getList(dto, user_id)
  }

  async getMedia(id: string, user_id: string): Promise<Media> {
    return await this.mediaManagerService.getMedia(id, user_id)
  }

  async createMedia(dto: CreateMediaDto, user_id: string): Promise<Media> {
    return await this.mediaManagerService.create({ ...dto, userId: user_id })
  }

  async updateMedia(id: string, dto: UpdateMediaDto): Promise<MessageDto> {
    await this.mediaManagerService.update(id, dto)
    return new MessageDto('Media updated')
  }

  async updateMediaPath(path: string, new_path: string): Promise<MessageDto> {
    await this.mediaManagerService.updatePath(path, new_path)
    return new MessageDto('Media path updated')
  }

  async removeMedia(id: string): Promise<MessageDto> {
    await this.mediaManagerService.remove(id)
    return new MessageDto('Media removed')
  }

  async uploadMediaFile(file: Express.Multer.File, id: string) {
    const new_file_path = `${TENANT_PATH_BUILDER.users(id)}/${Date.now()}_img${path.extname(file.originalname)}`
    const url = await this.s3Service.uploadFile(new_file_path, file.buffer)
    return {
      url,
    }
  }
}
