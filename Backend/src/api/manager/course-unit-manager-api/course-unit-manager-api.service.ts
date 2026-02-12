import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import * as path from 'path'

import { UserService } from '@/modules/core/user/user.service'
import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { CourseUnitLessonsManagerService } from '../../../modules/managers/course-unit-lessons-manager/course-unit-lessons-manager.service'
import { CourseUnitManagerService } from '../../../modules/managers/course-unit-manager/course-unit-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { AddLessonToModuleDto } from './dtos/add-lesson-to-module.dto'
import { CourseUnitSearchOptions } from './dtos/course-unit-search-option.dto'
import { CreateCourseUnitDto } from './dtos/create-course-unit.dto'
import { RemoveLessonFromModuleDto } from './dtos/remove-lesson-from-module.dto'
import { UpdateCourseUnitDto } from './dtos/update-course-unit.dto'
import { UpdateModuleLessonDto } from './dtos/update-module-lesson.dto'

@Injectable()
export class CourseUnitManagerApiService {
  constructor(
    private s3Service: S3Service,
    private eventEmitter: EventEmitter2,
    private courseUnitManagerService: CourseUnitManagerService,
    private courseUnitLessonMangerService: CourseUnitLessonsManagerService,
    private userService: UserService,
  ) {}

  async getCourseUnitList(
    userId: string,
    dto: CourseUnitSearchOptions,
  ): Promise<PageDto<CourseUnit>> {
    const user = await this.userService.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    return await this.courseUnitManagerService.getList(userId, dto)
  }

  async getOwnCourseUnitList(
    userId: string,
    dto: CourseUnitSearchOptions,
  ): Promise<PageDto<CourseUnit>> {
    const user = await this.userService.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    return await this.courseUnitManagerService.getList(userId, dto)
  }

  async getCatalogCourseUnitList(
    userId: string,
    dto: CourseUnitSearchOptions,
    school_id: string,
  ): Promise<PageDto<CourseUnit>> {
    const user = await this.userService.findOne({ where: { id: userId } })

    if (!user) {
      throw new BadRequestException(`No user found with ID ${userId}`)
    }

    return await this.courseUnitManagerService.getCatalogList(
      userId,
      dto,
      school_id,
    )
  }

  async getCourseUnit(id: string): Promise<CourseUnit> {
    return await this.courseUnitManagerService.getCourseUnit(id, true)
  }

  async createCourseUnit(
    userId: string,
    dto: CreateCourseUnitDto,
    school_id: string,
  ): Promise<CourseUnit> {
    return await this.courseUnitManagerService.create(userId, dto, school_id)
  }

  async updateCourseUnit(
    id: string,
    dto: UpdateCourseUnitDto,
  ): Promise<MessageDto> {
    await this.courseUnitManagerService.update(id, dto)
    return new MessageDto('CourseUnit udpated')
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const courseUnit = await this.courseUnitManagerService.getCourseUnit(
      id,
      false,
    )
    if (!courseUnit)
      throw new NotFoundException(`Course unit ${id} doesn't exist`)
    const old_file_path = courseUnit.avatar
      ? `${TENANT_PATH_BUILDER.courseUnits(org_id, id)}/${path.basename(courseUnit.avatar)}`
      : ''
    const new_file_path = `${TENANT_PATH_BUILDER.courseUnits(org_id, id)}/${Date.now()}_avatar${path.extname(file.originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, file.buffer)

    await this.courseUnitManagerService.updateAvatar(id, { avatar })
    if (courseUnit.avatar)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('Avatar updated')
  }

  async updateBackground(
    id: string,
    background: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const courseUnit = await this.courseUnitManagerService.getCourseUnit(
      id,
      false,
    )
    if (!courseUnit) {
      throw new NotFoundException(`Course unit ${id} doesn't exist`)
    }

    const old_file_path = courseUnit.background
      ? `${TENANT_PATH_BUILDER.courseUnits(org_id, id)}/${path.basename(courseUnit.background)}`
      : ''
    const new_file_path = `${TENANT_PATH_BUILDER.courseUnits(org_id, id)}/${Date.now()}_background${path.extname(background.originalname)}`
    const backgroundPath = await this.s3Service.uploadFile(
      new_file_path,
      background.buffer,
    )

    await this.courseUnitManagerService.updateBackground(id, {
      background: backgroundPath,
    })
    if (courseUnit.background) {
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    }
    return new MessageDto('Background updated')
  }

  async removeCourseUnit(id: string): Promise<MessageDto> {
    await this.courseUnitManagerService.remove(id)
    return new MessageDto('CourseUnit removed')
  }

  async addLesson(id: string, dto: AddLessonToModuleDto): Promise<MessageDto> {
    await this.courseUnitLessonMangerService.addLessonToModule(id, dto)
    return new MessageDto('lesson added to class')
  }

  async removeLesson(
    id: string,
    dto: RemoveLessonFromModuleDto,
  ): Promise<MessageDto> {
    await this.courseUnitLessonMangerService.removeLessonFromModule(id, dto)
    return new MessageDto('lesson remod from class')
  }

  async updateLesson(
    id: string,
    dto: UpdateModuleLessonDto,
  ): Promise<MessageDto> {
    await this.courseUnitLessonMangerService.updateModuleLesson(id, dto)
    return new MessageDto('module lesson updated')
  }
}
