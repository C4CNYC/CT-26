import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { LessonSearchOptions } from '../../../api/manager/lesson-manager-api/dtos/lesson-search-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CodeAssignment } from './code-assignment.entity'

@Injectable()
export class CodeAssignmentService extends BaseService<CodeAssignment> {
  constructor(
    @InjectRepository(CodeAssignment)
    public repository: Repository<CodeAssignment>,
  ) {
    super(CodeAssignment, repository)
  }

  async getList(
    page_options_dto: LessonSearchOptions,
  ): Promise<PageDto<CodeAssignment>> {
    const query_builder = this.getRepository().createQueryBuilder('code')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .orderBy('code.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<CodeAssignment>,
    filters: LessonSearchOptions,
  ): SelectQueryBuilder<CodeAssignment> {
    const { name } = filters
    if (name)
      query.andWhere(`code.name ILIKE :name`, {
        name: `%${name}%`,
      })
    return query
  }
}
