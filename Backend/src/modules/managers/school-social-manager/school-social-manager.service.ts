import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateSchoolSocialDto } from '../../../api/manager/school-social-manager-api/dtos/create-school-social.dto'
import { UpdateSchoolSocialDto } from '../../../api/manager/school-social-manager-api/dtos/update-school-social.dto'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { SchoolSocialService } from '../../core/school-social/school-sochial.service'
import { SchoolSocial } from '../../core/school-social/school-social.entity'
import { SchoolService } from '../../core/school/school.service'

@Injectable()
export class SchoolSocialManagerService {
  constructor(
    private schoolService: SchoolService,
    private schoolSocialService: SchoolSocialService,
  ) {}

  async createSocialLink(
    school_id: string,
    dto: CreateSchoolSocialDto,
  ): Promise<SchoolSocial> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: { socials: true },
    })
    if (!school) throw new NotFoundException(`school doesn't exist`)
    const social = await this.schoolSocialService.create(dto)
    school.socials.push(social)
    await this.schoolService.repository.save(school)
    return social
  }

  async deleteSocialLink(
    school_id: string,
    social_id: string,
  ): Promise<MessageDto> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: { socials: true },
    })
    if (!school) throw new NotFoundException(`school doesn't exist`)
    school.socials = school.socials.filter((s) => s.id !== social_id)
    await this.schoolService.repository.save(school)
    return new MessageDto('social removed')
  }

  async updateSocialLink(
    social_id: string,
    dto: UpdateSchoolSocialDto,
  ): Promise<MessageDto> {
    await this.schoolSocialService.update(social_id, dto)
    return new MessageDto('social updated')
  }
}
