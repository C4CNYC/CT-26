import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { MediaSearchOptions } from '../../../api/manager/media-manager-api/dtos/media-search-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Media } from './media.entity'

@Injectable()
export class MediaService extends BaseService<Media> {
  constructor(
    @InjectRepository(Media)
    public repository: Repository<Media>,
  ) {
    super(Media, repository)
  }

  async getList(
    page_options_dto: MediaSearchOptions,
    userId: string,
    schoolId: string | undefined,
  ): Promise<PageDto<Media>> {
    const query_builder = this.getRepository().createQueryBuilder('media')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .where(
        '(media.acl = :acl AND media.userId = :userId) OR media.acl = :acl2',
        {
          userId,
          acl: 'private',
          acl2: 'public',
        },
      )
      .where('media.schoolId = :schoolId OR media.schoolId IS NULL', {
        schoolId,
      })
      .orderBy('media.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async updateMediaPath(path: string, newPath: string) {
    return await this.getRepository()
      .createQueryBuilder('media')
      .update(Media)
      .set({
        name: () => `REPLACE(name, '${path}', '${newPath}')`,
      })
      .where(`name LIKE '${path}%'`)
      .execute()
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Media>,
    filters: MediaSearchOptions,
  ): SelectQueryBuilder<Media> {
    const { name } = filters
    if (name)
      query.andWhere(`media.name ILIKE :name`, {
        name: `%${name}%`,
      })
    return query
  }
}
