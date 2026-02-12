import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { Class } from '../../../modules/core/class/class.entity'
import { SchoolClassManagerService } from '../../../modules/managers/school-class-manager/school-class-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { AddCourseToClassDto } from './dtos/add-course-to-class.dto'
import { ClassSearchOptions } from './dtos/class-search-option.dto'
import { CreateClassDto } from './dtos/create-class.dto'
import { UpdateClassSettingDto } from './dtos/update-class-setting.dto'
import { UpdateClassDto } from './dtos/update-class.dto'

import path = require('path')

@Injectable()
export class SchoolClassManagerApiService {
  constructor(
    private s3Service: S3Service,
    private eventEmitter: EventEmitter2,
    private schoolClassManagerService: SchoolClassManagerService,
  ) {}

  async getClasses(
    school_id: string,
    dto: PageOptionsDto & ClassSearchOptions,
  ): Promise<PageDto<Class>> {
    return await this.schoolClassManagerService.getClasses(school_id, dto)
  }

  async getClass(class_id: string): Promise<Class> {
    return await this.schoolClassManagerService.getClass(class_id)
  }

  async createClass(
    school_id: string,
    org_id: string,
    dto: CreateClassDto,
  ): Promise<Class> {
    return await this.schoolClassManagerService.createClass(school_id, dto)
  }

  async updateClass(
    class_id: string,
    dto: UpdateClassDto,
  ): Promise<MessageDto> {
    await this.schoolClassManagerService.updateClass(class_id, dto)
    return new MessageDto('class updated')
  }

  async updateClassSetting(
    class_id: string,
    dto: UpdateClassSettingDto,
  ): Promise<MessageDto> {
    await this.schoolClassManagerService.updateClassSetting(class_id, dto)
    return new MessageDto('class setting updated')
  }

  async updateAvatar(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const schoolClass = await this.schoolClassManagerService.getClass(id)
    const old_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${path.basename(schoolClass.avatar || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${Date.now()}_avatar${path.extname(originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.schoolClassManagerService.updateClass(id, { avatar })
    if (schoolClass.avatar)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('avatar updated')
  }

  async removeClass(class_id: string): Promise<MessageDto> {
    await this.schoolClassManagerService.removeClass(class_id)
    return new MessageDto('class removed')
  }

  async addCourse(id: string, dto: AddCourseToClassDto): Promise<MessageDto> {
    await this.schoolClassManagerService.addCourse(id, dto)
    return new MessageDto('course added')
  }
  async removeCourse(
    id: string,
    dto: AddCourseToClassDto,
  ): Promise<MessageDto> {
    await this.schoolClassManagerService.removeCourse(id, dto)
    return new MessageDto('course removed')
  }
}
