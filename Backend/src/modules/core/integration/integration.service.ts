import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { IntegrationSearchOptions } from '../../../api/manager/integration-manager-api/dtos/content-integration-search-option.dto'
import { CreateIntegrationDto } from '../../../api/manager/integration-manager-api/dtos/create-content-integration.dto'
import { UpdateIntegrationDto } from '../../../api/manager/integration-manager-api/dtos/update-content-integration.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Role } from '../user/enums/role.enum'
import { Integration } from './integration.entity'

@Injectable()
export class IntegrationService extends BaseService<Integration> {
  constructor(
    @InjectRepository(Integration)
    public repository: Repository<Integration>,
  ) {
    super(Integration, repository)
  }

  async getList(
    page_options_dto: IntegrationSearchOptions,
    org_id?: string,
    userRole?: Role,
  ): Promise<PageDto<Integration>> {
    const query_builder =
      this.getRepository().createQueryBuilder('integrations')

    this.applyOptionalFilters(query_builder, page_options_dto, org_id, userRole)
      .orderBy('integrations.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async createWithOrg(
    dto: CreateIntegrationDto,
    org_id: string,
  ): Promise<Integration> {
    return await this.create({
      ...dto,
      organization_id: org_id,
      public: false,
    })
  }

  async updateWithAuth(
    id: string,
    dto: UpdateIntegrationDto,
    org_id?: string,
    userRole?: Role,
  ): Promise<void> {
    const integration = await this.findOne({ where: { id } })
    if (!integration) {
      throw new NotFoundException('Integration not found')
    }

    // Tenant check: non-super-admin can only update integrations belonging to their tenant
    if (userRole !== Role.SuperAdmin && integration.organization_id !== org_id) {
      throw new ForbiddenException('You cannot update this integration')
    }

    // Strip public field if user is not super-admin
    const updateData = { ...dto }
    if (userRole !== Role.SuperAdmin && updateData.public !== undefined) {
      delete updateData.public
    }

    await this.update(id, updateData)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Integration>,
    filters: IntegrationSearchOptions,
    org_id?: string,
    userRole?: Role,
  ): SelectQueryBuilder<Integration> {
    const { name, public: isPublic, organization_id } = filters

    if (name) {
      query.andWhere(`integrations.name ILIKE :name`, {
        name: `%${name}%`,
      })
    }

    // Visibility filter: if user is not super-admin, restrict to public or own tenant
    if (userRole !== Role.SuperAdmin && org_id) {
      query.andWhere(`(integrations.public = true OR integrations.organization_id = :org_id)`, {
        org_id,
      })
    }

    // Super-admin can filter by public and organization_id
    if (userRole === Role.SuperAdmin) {
      if (isPublic !== undefined) {
        query.andWhere(`integrations.public = :isPublic`, { isPublic })
      }
      if (organization_id) {
        query.andWhere(`integrations.organization_id = :organization_id`, { organization_id })
      }
    }

    return query
  }
}