import { ConflictException, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { UpdateStudentProfileDto } from '@/api/old-auth/dtos/update-student-profile.dto'
import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { S3Service } from '../../../providers/s3/s3.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { StudentService } from '../../core/student/student.service'
import { UserService } from '../../core/user/user.service'
import { ApplicationEventEnum } from '../users-manager/enums/application-event'

import path = require('path')

@Injectable()
export class StudentAuthManagerService {
  constructor(
    private studentService: StudentService,
    private eventEmitter: EventEmitter2,
    private s3Service: S3Service,
    private readonly userService: UserService,
  ) {}

  async updateProfile(
    studentId: string,
    userId: string,
    dto: UpdateStudentProfileDto,
  ): Promise<MessageDto> {
    if (dto.username) {
      const student = await this.studentService.findOne({
        where: { username: dto.username },
      })
      if (student) throw new ConflictException('username taken')
    }
    await this.studentService.update(studentId, dto)
    await this.userService.updateUserDetails(userId, dto)

    return new MessageDto('profile updated')
  }

  async updateAvatar(
    studentId: string,
    userId: string,
    { originalname, buffer }: Express.Multer.File,
    org_id: string,
  ): Promise<MessageDto> {
    const user = await this.studentService.findOne({
      where: { id: studentId },
    })
    const old_file_path = `${TENANT_PATH_BUILDER.students(org_id)}/${user.id}/${path.basename(user.avatar || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.students(org_id)}/${user.id}/avatar_${Date.now()}_${path.extname(originalname)}`

    const avatar = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.studentService.update(studentId, { avatar })
    await this.userService.updateUserDetails(userId, { avatar })

    if (user.avatar)
      this.eventEmitter.emit(ApplicationEventEnum.REMOVE_FILE, old_file_path)
    return new MessageDto('avatar updated')
  }
}
