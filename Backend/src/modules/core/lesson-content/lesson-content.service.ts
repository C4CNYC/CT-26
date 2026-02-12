import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { LessonContent } from './lesson-content.entity'

@Injectable()
export class LessonContentService extends BaseService<LessonContent> {
  constructor(
    @InjectRepository(LessonContent)
    public repository: Repository<LessonContent>,
  ) {
    super(LessonContent, repository)
  }

  async getList({
    lesson_id,
  }: {
    lesson_id: string
  }): Promise<LessonContent[]> {
    const query_builder = this.getRepository().createQueryBuilder('content')

    this.applyOptionalFilters(query_builder, { lesson_id })
      .orderBy('content.createdAt', Order.ASC)
      .leftJoinAndSelect('content.integrations', 'integrations')
      .leftJoinAndSelect('content.validations', 'validations')

    const { entities } = await query_builder.getRawAndEntities()

    return entities
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<LessonContent>,
    filters: { lesson_id: string },
  ): SelectQueryBuilder<LessonContent> {
    const { lesson_id } = filters
    if (lesson_id)
      query
        .innerJoin('content.lesson', 'lesson')
        .andWhere(`lesson.id = :lesson_id`, {
          lesson_id,
        })
    return query
  }
}
