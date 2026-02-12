import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { SkillSearchOptions } from '../../../api/manager/skill-manager-api/dtos/skill-search-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Skill } from './skill.entity'

@Injectable()
export class SkillService extends BaseService<Skill> {
  constructor(
    @InjectRepository(Skill)
    public repository: Repository<Skill>,
  ) {
    super(Skill, repository)
  }

  async getList(page_options_dto: SkillSearchOptions): Promise<PageDto<Skill>> {
    const query_builder = this.getRepository().createQueryBuilder('skills')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .orderBy('skills.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Skill>,
    filters: SkillSearchOptions,
  ): SelectQueryBuilder<Skill> {
    const { name } = filters
    if (name)
      query.andWhere(`lesson.name ILIKE :name`, {
        name: `%${name}%`,
      })
    return query
  }
}
