import { Injectable } from '@nestjs/common'

import { SchoolSocial } from '../../../modules/core/school-social/school-social.entity'
import { SchoolSocialManagerService } from '../../../modules/managers/school-social-manager/school-social-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { CreateSchoolSocialDto } from './dtos/create-school-social.dto'
import { UpdateSchoolSocialDto } from './dtos/update-school-social.dto'

@Injectable()
export class SchoolSocialManagerApiService {
  constructor(private schoolSocialMangerService: SchoolSocialManagerService) {}

  async createSocialLink(
    school_id: string,
    dto: CreateSchoolSocialDto,
  ): Promise<SchoolSocial> {
    return await this.schoolSocialMangerService.createSocialLink(school_id, dto)
  }
  async updateSocialLink(
    school_id: string,
    social_id: string,
    dto: UpdateSchoolSocialDto,
  ): Promise<MessageDto> {
    return await this.schoolSocialMangerService.updateSocialLink(social_id, dto)
  }
  async deleteSocialLink(
    school_id: string,
    social_id: string,
  ): Promise<MessageDto> {
    return await this.schoolSocialMangerService.deleteSocialLink(
      school_id,
      social_id,
    )
  }
}
