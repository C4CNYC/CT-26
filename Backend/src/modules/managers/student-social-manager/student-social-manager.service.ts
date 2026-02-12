import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateStudentSocialDto } from '../../../api/student/student-social-api/dtos/create-student-social.dto'
import { UpdateStudentSocialDto } from '../../../api/student/student-social-api/dtos/update-student-social.dto'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { StudentSocial } from '../../core/student-social/student-social.entity'
import { StudentSocialService } from '../../core/student-social/student-social.service'
import { StudentService } from '../../core/student/student.service'

@Injectable()
export class StudentSocialManagerService {
  constructor(
    private studentService: StudentService,
    private studentSocialService: StudentSocialService,
  ) {}

  async getByStudent(student_id: string): Promise<StudentSocial[]> {
    return await this.studentSocialService.find({
      student: { id: student_id },
    })
  }

  async createSocialLink(
    student_id: string,
    dto: CreateStudentSocialDto,
  ): Promise<StudentSocial> {
    const school = await this.studentService.findOne({
      where: { id: student_id },
      relations: { socials: true },
    })
    if (!school) throw new NotFoundException(`student doesn't exist`)
    const social = await this.studentSocialService.create(dto)
    school.socials.push(social)
    await this.studentService.repository.save(school)
    return social
  }

  async deleteSocialLink(
    student_id: string,
    social_id: string,
  ): Promise<MessageDto> {
    const school = await this.studentService.findOne({
      where: { id: student_id },
      relations: { socials: true },
    })
    if (!school) throw new NotFoundException(`student doesn't exist`)
    school.socials = school.socials.filter((s) => s.id !== social_id)
    await this.studentService.repository.save(school)
    return new MessageDto('social removed')
  }

  async updateSocialLink(
    social_id: string,
    dto: UpdateStudentSocialDto,
  ): Promise<MessageDto> {
    await this.studentSocialService.update(social_id, dto)
    return new MessageDto('social updated')
  }
}
