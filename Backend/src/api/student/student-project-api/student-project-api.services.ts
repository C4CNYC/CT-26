import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { StudentProject } from '../../../modules/core/student-project/student-project.entity'
import { StudentService } from '../../../modules/core/student/student.service'
import { StudentProjectManagerService } from '../../../modules/managers/student-project-manager/student-project-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateProjectDto } from './dtos/create-project.dto'
import { MyPublicProjectSearchOptions } from './dtos/public-project-search.dto'
import { MyProjectSearchOptions } from './dtos/search-project.dto'
import { UpdateProjectDto } from './dtos/update-project.dto'

import path = require('path')

@Injectable()
export class StudentProjectApiService {
  constructor(
    private s3Service: S3Service,
    private eventEmitter: EventEmitter2,
    private studentProjectManagerService: StudentProjectManagerService,
    private studentService: StudentService,
  ) {}

  async getPublicProjectList(
    dot: MyPublicProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
    return await this.studentProjectManagerService.getPublicProjcetList(dot)
  }

  async getProjectList(
    student_id: string,
    dto: MyProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
    return await this.studentProjectManagerService.getProjcetList(
      student_id,
      dto,
    )
  }

  async getProject(id: string, student_id: string): Promise<StudentProject> {
    await this.studentProjectManagerService.checkPermission(id, student_id)
    return await this.studentProjectManagerService.getProject(id, student_id)
  }

  async create(
    dto: CreateProjectDto,
    student_id: string,
  ): Promise<StudentProject> {
    const student = await this.studentService.findOne({
      where: { id: student_id },
      relations: { projects: true },
    })
    const project = await this.studentProjectManagerService.create({ ...dto })
    student.projects.push(project)
    await this.studentService.repository.save(student)
    return project
  }

  async update(
    id: string,
    student_id: string,
    dto: UpdateProjectDto,
  ): Promise<MessageDto> {
    await this.studentProjectManagerService.checkPermission(id, student_id)
    await this.studentProjectManagerService.update(id, student_id, dto)
    return new MessageDto('project updated')
  }

  async updateCover(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
    studet_id: string,
  ): Promise<MessageDto> {
    const project = await this.studentProjectManagerService.getProject(
      id,
      studet_id,
    )
    const old_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${path.basename(project.cover || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${Date.now()}_cover${path.extname(originalname)}`
    const cover = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.studentProjectManagerService.update(id, studet_id, { cover })
    if (project.cover)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('cover updated')
  }

  async updateAvatar(
    id: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
    studet_id: string,
  ): Promise<MessageDto> {
    const project = await this.studentProjectManagerService.getProject(id)
    const old_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${path.basename(project.avatar || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.schools(org_id, id)}/${Date.now()}_avatar${path.extname(originalname)}`
    const avatar = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.studentProjectManagerService.update(id, studet_id, { avatar })
    if (project.cover)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('cover updated')
  }

  async remove(id: string, student_id: string): Promise<MessageDto> {
    await this.studentProjectManagerService.checkPermission(id, student_id)
    await this.studentProjectManagerService.remove(id, student_id)
    return new MessageDto('project removed')
  }
}
