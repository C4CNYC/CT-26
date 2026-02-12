import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { PropertiesearchOptions } from '@/api/admin/properties/dtos/properties.search.dto'

import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Properties } from './properties.entity'

@Injectable()
export class Propertieservice extends BaseService<Properties> {
  constructor(
    @InjectRepository(Properties)
    public repository: Repository<Properties>,
  ) {
    super(Properties, repository)
  }

  async getList(
    page_options_dto: PropertiesearchOptions,
  ): Promise<PageDto<Properties>> {
    const query_builder = this.getRepository().createQueryBuilder('Properties')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .orderBy('Properties.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Properties>,
    filters: PropertiesearchOptions,
  ): SelectQueryBuilder<Properties> {
    const { entityType, entityId, propertyName, propertyValue } = filters

    if (entityType)
      query.andWhere(`Properties.entityType = :entityType`, { entityType })
    if (entityId)
      query.andWhere(`Properties.entityId = :entityId`, { entityId })
    if (propertyName)
      query.andWhere(`Properties.propertyName ILIKE :propertyName`, {
        propertyName,
      })
    if (propertyValue)
      query.andWhere(`Properties.propertyValue ILIKE :propertyValue`, {
        propertyValue,
      })
    return query
  }
}
