import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { IntegrationSearchOptions } from '../../../api/manager/integration-manager-api/dtos/content-integration-search-option.dto'
import { CreateIntegrationDto } from '../../../api/manager/integration-manager-api/dtos/create-content-integration.dto'
import { UpdateIntegrationDto } from '../../../api/manager/integration-manager-api/dtos/update-content-integration.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Role } from '../../core/user/enums/role.enum'
import { Integration } from '../../core/integration/integration.entity'
import { IntegrationService } from '../../core/integration/integration.service'

@Injectable()
export class IntegrationManagerService {
  constructor(private integrationService: IntegrationService) {}

  async getList(
    dto: IntegrationSearchOptions,
    org_id?: string,
    userRole?: Role,
  ): Promise<PageDto<Integration>> {
    return await this.integrationService.getList(dto, org_id, userRole)
  }

  async getIntegration(
    id: string,
    org_id?: string,
    userRole?: Role,
  ): Promise<Integration> {
    const integration = await this.integrationService.findOne({
      where: { id },
    })
    if (!integration) throw new NotFoundException("integration doesn't exist")
    // Tenant visibility check
    if (userRole !== Role.SuperAdmin && org_id && integration.organization_id !== org_id && !integration.public) {
      throw new NotFoundException("integration doesn't exist")
    }
    return integration
  }

  async getIntegrationWithAuth(
    id: string,
    org_id?: string,
    userRole?: Role,
  ): Promise<Integration> {
    return this.getIntegration(id, org_id, userRole)
  }

  async create(
    dto: CreateIntegrationDto,
    org_id: string,
  ): Promise<Integration> {
    return await this.integrationService.createWithOrg(dto, org_id)
  }

  async udpate(
    id: string,
    dto: UpdateIntegrationDto,
    org_id?: string,
    userRole?: Role,
  ): Promise<void> {
    await this.integrationService.updateWithAuth(id, dto, org_id, userRole)
  }

  async remove(
    id: string,
    org_id?: string,
    userRole?: Role,
  ): Promise<void> {
    // Ensure tenant ownership or super-admin
    const integration = await this.integrationService.findOne({
      where: { id },
    })
    if (!integration) throw new NotFoundException("integration doesn't exist")
    if (userRole !== Role.SuperAdmin && org_id && integration.organization_id !== org_id) {
      throw new ForbiddenException('You cannot delete this integration')
    }
    await this.integrationService.remove(id)
  }
}
