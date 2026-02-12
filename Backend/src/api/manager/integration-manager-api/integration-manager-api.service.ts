import { Injectable } from '@nestjs/common'

import { Integration } from '../../../modules/core/integration/integration.entity'
import { IntegrationManagerService } from '../../../modules/managers/content-integration-manager/content-integration-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { IntegrationSearchOptions } from './dtos/content-integration-search-option.dto'
import { CreateIntegrationDto } from './dtos/create-content-integration.dto'
import { UpdateIntegrationDto } from './dtos/update-content-integration.dto'

@Injectable()
export class IntegrationManagerApiService {
  constructor(private integrationManagerService: IntegrationManagerService) {}

  async getContentIntegrationList(
    dto: IntegrationSearchOptions,
    org_id?: string,
    userRole?: Role,
  ): Promise<PageDto<Integration>> {
    return await this.integrationManagerService.getList(dto, org_id, userRole)
  }

  async getContentIntegration(
    id: string,
    org_id?: string,
    userRole?: Role,
  ): Promise<Integration> {
    return await this.integrationManagerService.getIntegration(id, org_id, userRole)
  }

  async createContentIntegration(
    dto: CreateIntegrationDto,
    org_id: string,
  ): Promise<Integration> {
    return await this.integrationManagerService.create(dto, org_id)
  }

  async updateContentIntegration(
    id: string,
    dto: UpdateIntegrationDto,
    org_id?: string,
    userRole?: Role,
  ): Promise<MessageDto> {
    await this.integrationManagerService.udpate(id, dto, org_id, userRole)
    return new MessageDto('integration updated')
  }

  async removeContentIntegration(
    id: string,
    org_id?: string,
    userRole?: Role,
  ): Promise<MessageDto> {
    await this.integrationManagerService.remove(id, org_id, userRole)
    return new MessageDto('integration removed')
  }
}
