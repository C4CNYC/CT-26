import { Injectable } from '@nestjs/common'

import { StudentSocial } from '../../../modules/core/student-social/student-social.entity'
import { StudentSocialManagerService } from '../../../modules/managers/student-social-manager/student-social-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { CreateStudentSocialDto } from './dtos/create-student-social.dto'
import { UpdateStudentSocialDto } from './dtos/update-student-social.dto'

@Injectable()
export class StudentSocialApiService {
  constructor(
    private studentSocialManagerService: StudentSocialManagerService,
  ) {}

  async getStudentSocials(student_id: string): Promise<StudentSocial[]> {
    return await this.studentSocialManagerService.getByStudent(student_id)
  }
  async createSocialLink(
    student_id: string,
    dto: CreateStudentSocialDto,
  ): Promise<StudentSocial> {
    return await this.studentSocialManagerService.createSocialLink(
      student_id,
      dto,
    )
  }
  async updateSocialLink(
    student_id: string,
    social_id: string,
    dto: UpdateStudentSocialDto,
  ): Promise<MessageDto> {
    return await this.studentSocialManagerService.updateSocialLink(
      social_id,
      dto,
    )
  }
  async deleteSocialLink(
    student_id: string,
    social_id: string,
  ): Promise<MessageDto> {
    return await this.studentSocialManagerService.deleteSocialLink(
      student_id,
      social_id,
    )
  }
}
