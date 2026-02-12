import { Injectable } from '@nestjs/common'

import { Properties } from '@/modules/core/properties/properties.entity'
import { PropertiesManagerService } from '@/modules/managers/properties-manager/properties-manager-service'

import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { PropertiesCreateOptions } from './dtos/properties.create.dto'
import { PropertiesearchOptions } from './dtos/properties.search.dto'

@Injectable()
export class PropertiesApiService {
  constructor(private propertiesManagerService: PropertiesManagerService) {}

  async addProperty(dto: PropertiesCreateOptions): Promise<MessageDto> {
    await this.propertiesManagerService.addProperty(dto)
    return new MessageDto('added')
  }

  async getProperty(dto: PropertiesearchOptions): Promise<PageDto<Properties>> {
    return await this.propertiesManagerService.getProperties(dto)
  }

  async getUserProperties(
    student_id: string,
    dto: PropertiesearchOptions,
  ): Promise<PageDto<Properties>> {
    return await this.propertiesManagerService.getProperties({
      ...dto,
      entityType: 'User',
      entityId: student_id,
      skip: 0,
    })
  }

  async deleteProperty(propertyId: string): Promise<MessageDto> {
    await this.propertiesManagerService.removeProperty(propertyId)
    return new MessageDto('deleted')
  }
  async updateProperty(
    propertyId: string,
    dto: PropertiesCreateOptions,
  ): Promise<MessageDto> {
    await this.propertiesManagerService.update(propertyId, dto)
    return new MessageDto('updated')
  }
}
