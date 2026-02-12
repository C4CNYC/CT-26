import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CourseAuthorSearchOptions } from '../../../api/manager/course-author-manager-api/dtos/course-author-search-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseAuthor } from './course-authors.entity'

@Injectable()
export class CourseAuthorService extends BaseService<CourseAuthor> {
  constructor(
    @InjectRepository(CourseAuthor)
    public repository: Repository<CourseAuthor>,
  ) {
    super(CourseAuthor, repository)
  }

  async getList(
    page_options_dto: CourseAuthorSearchOptions,
  ): Promise<PageDto<CourseAuthor>> {
    const query_builder =
      this.getRepository().createQueryBuilder('course-author')

    query_builder
      .orderBy('course-author.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    if (page_options_dto.email) {
      query_builder.andWhere('course-author.email = :email', {
        email: `%${page_options_dto.email || ''}%`,
      })
    }

    if (page_options_dto.course_id) {
      query_builder
        .leftJoin('course-author.course', 'course')
        .andWhere('course.id = :course_id', {
          course_id: page_options_dto.course_id,
        })
    }

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }
}
