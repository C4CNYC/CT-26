import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { CourseUnitAuthor } from '../../../modules/core/course-unit-authors/course-unit-authors.entity'
import { CourseUnitAuthorManagerService } from '../../../modules/managers/course-unit-author-manager/course-unit-author-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateUnitAuthorDto } from './dtos/create-unit-author.dto'
import { UnitAuthorSearchOptions } from './dtos/unit-author-search-option.dto'
import { UpdateUnitAuthorDto } from './dtos/update-unit-author.dto'

import path = require('path')

@Injectable()
export class CourseUnitAuthorManagerApiService {
  constructor(
    private s3Service: S3Service,
    private courseUnitAuthorManagerService: CourseUnitAuthorManagerService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getCourseUnitAuthorList(
    dto: UnitAuthorSearchOptions,
  ): Promise<PageDto<CourseUnitAuthor>> {
    return await this.courseUnitAuthorManagerService.getList(dto)
  }

  async getCourseUnitAuthor(id: string): Promise<CourseUnitAuthor> {
    return await this.courseUnitAuthorManagerService.getCourseUnitAuthor(id)
  }

  async createCourseUnitAuthor(
    dto: CreateUnitAuthorDto,
  ): Promise<CourseUnitAuthor> {
    return await this.courseUnitAuthorManagerService.create(dto)
  }

  async updateCourseUnitAuthor(
    id: string,
    dto: UpdateUnitAuthorDto,
  ): Promise<MessageDto> {
    await this.courseUnitAuthorManagerService.update(id, dto)
    return new MessageDto('author udpated')
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const author = await this.courseUnitAuthorManagerService.getCourseUnitAuthor(id)
    const old_file_path = author.avatar
      ? `${TENANT_PATH_BUILDER.courses(org_id, id)}/${path.basename(author.avatar)}`
      : ''
    const new_file_path = `${TENANT_PATH_BUILDER.author(org_id, id)}/${Date.now()}_avatar${path.extname(file.originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, file.buffer)

    await this.courseUnitAuthorManagerService.updateAvatar(id, { avatar })
    if (author.avatar)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('Cover updated')
  }

  async removeCourseUnitAuthor(id: string): Promise<MessageDto> {
    await this.courseUnitAuthorManagerService.remove(id)
    return new MessageDto('author removed')
  }
}
