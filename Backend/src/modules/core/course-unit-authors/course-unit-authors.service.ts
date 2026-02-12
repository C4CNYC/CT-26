import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UnitAuthorSearchOptions } from '../../../api/manager/course-unit-author-manager-api/dtos/unit-author-search-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseUnitAuthor } from './course-unit-authors.entity'

@Injectable()
export class CourseUnitAuthorService extends BaseService<CourseUnitAuthor> {
  constructor(
    @InjectRepository(CourseUnitAuthor)
    public repository: Repository<CourseUnitAuthor>,
  ) {
    super(CourseUnitAuthor, repository)
  }

  async getList(
    page_options_dto: UnitAuthorSearchOptions,
  ): Promise<PageDto<CourseUnitAuthor>> {
    const query_builder =
      this.getRepository().createQueryBuilder('course-unit-author')

    query_builder
      .orderBy('course-unit-author.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    if (page_options_dto.email) {
      query_builder.andWhere('course-unit-author.email = :email', {
        email: `%${page_options_dto.email || ''}%`,
      })
    }

    if (page_options_dto.course_unit_id) {
      query_builder
        .leftJoin('course-unit-author.course_unit', 'course_unit')
        .andWhere('course_unit.id = :course_unit_id', {
          course_unit_id: page_options_dto.course_unit_id,
        })
    }

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }
}
