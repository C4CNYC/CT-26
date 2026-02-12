import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { Course } from '../../../modules/core/course/course.entity'
import { CourseCourseUnitManagerService } from '../../../modules/managers/course-course-unit-manager/course-course-unit-manager.service'
import { CourseManagerService } from '../../../modules/managers/course-manager/course-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ClassSearchOptions } from '../school-class-manager-api/dtos/class-search-option.dto'
import { AddModuleToCourseDto } from './dtos/add-module-to-course.dto'
import { CreateCourseDto } from './dtos/create-course.dto'
import { RemoveModuleFromCourseDto } from './dtos/remove-module-from-course.dto'
import { UpdateCoursetDto } from './dtos/update-course.dto'

import path = require('path')

@Injectable()
export class CourseManagerApiService {
  constructor(
    private s3Service: S3Service,
    private courseManagerService: CourseManagerService,
    private eventEmitter: EventEmitter2,
    private courseCourseUnitService: CourseCourseUnitManagerService,
  ) {}

  async getCourseList(
    dto: ClassSearchOptions,
    request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerService.getList(dto, request)
  }

  async getPublicCourseList(
    dto: ClassSearchOptions,
    request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerService.getPublicList(dto, request.org_id)
  }

  async getCatalogCourseList(
    dto: ClassSearchOptions,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerService.getCatalogList(dto)
  }

  async getOwnCourseList(
    dto: ClassSearchOptions,
    request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerService.getOwnList(dto, request)
  }

  async getCourse(id: string): Promise<Course> {
    return await this.courseManagerService.getCourse(id, { units: true })
  }

  async createCourse(
    dto: CreateCourseDto,
    request: RequestWithMeta,
  ): Promise<Course> {
    return await this.courseManagerService.create(dto, request)
  }

  async updateCourse(
    id: string,
    dto: UpdateCoursetDto,
    org_id: string,
  ): Promise<MessageDto> {
    await this.courseManagerService.update(id, dto, org_id)
    return new MessageDto('Course udpated')
  }

  async updateCover(
    id: string,
    file: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const course = await this.courseManagerService.getCourse(id, {}, false)
    const old_file_path = course.cover
      ? `${TENANT_PATH_BUILDER.courses(org_id, id)}/${path.basename(course.cover)}`
      : ''
    const new_file_path = `${TENANT_PATH_BUILDER.courses(org_id, id)}/${Date.now()}_cover${path.extname(file.originalname)}`
    const cover = await this.s3Service.uploadFile(new_file_path, file.buffer)

    await this.courseManagerService.updateCover(id, { cover })
    if (course.cover)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('Cover updated')
  }

  async addUnit(id: string, dto: AddModuleToCourseDto): Promise<MessageDto> {
    await this.courseCourseUnitService.addUnitToCourse(id, dto)
    return new MessageDto('lesson added to class')
  }

  async removeUnit(
    id: string,
    dto: RemoveModuleFromCourseDto,
  ): Promise<MessageDto> {
    await this.courseCourseUnitService.removeUnitFromCourse(id, dto)
    return new MessageDto('lesson remod from class')
  }

  async removeCourse(id: string): Promise<MessageDto> {
    await this.courseManagerService.remove(id)
    return new MessageDto('Course removed')
  }
}
