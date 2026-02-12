import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { CourseAuthor } from '../../../modules/core/course-authors/course-authors.entity'
import { CourseAuthorManagerService } from '../../../modules/managers/course-author-manager/course-author-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseAuthorSearchOptions } from './dtos/course-author-search-option.dto'
import { CreateCourseAuthorDto } from './dtos/create-course-author.dto'
import { UpdateCourseAuthorDto } from './dtos/update-course-author.dto'

import path = require('path')

@Injectable()
export class CourseAuthorManagerApiService {
  constructor(
    private s3Service: S3Service,
    private courseAuthorManagerService: CourseAuthorManagerService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getCourseAuthorList(
    dto: CourseAuthorSearchOptions,
  ): Promise<PageDto<CourseAuthor>> {
    return await this.courseAuthorManagerService.getList(dto)
  }

  async getCourseAuthor(id: string): Promise<CourseAuthor> {
    return await this.courseAuthorManagerService.getCourseAuthor(id)
  }

  async createCourseAuthor(dto: CreateCourseAuthorDto): Promise<CourseAuthor> {
    return await this.courseAuthorManagerService.create(dto)
  }

  async updateCourseAuthor(
    id: string,
    dto: UpdateCourseAuthorDto,
  ): Promise<MessageDto> {
    await this.courseAuthorManagerService.update(id, dto)
    return new MessageDto('author udpated')
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const author = await this.courseAuthorManagerService.getCourseAuthor(id)
    const old_file_path = author.avatar
      ? `${TENANT_PATH_BUILDER.courses(org_id, id)}/${path.basename(author.avatar)}`
      : ''
    const new_file_path = `${TENANT_PATH_BUILDER.author(org_id, id)}/${Date.now()}_avatar${path.extname(file.originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, file.buffer)

    await this.courseAuthorManagerService.updateAvatar(id, { avatar })
    if (author.avatar)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('Cover updated')
  }

  async removeCourseAuthor(id: string): Promise<MessageDto> {
    await this.courseAuthorManagerService.remove(id)
    return new MessageDto('author removed')
  }
}
