import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { calcSkip } from '@/utils/paginatrion-skip'

import { SchoolOptionDto } from '../../../api/admin/school-api/dtos/school-option.dto'
import { SearchSchoolPageOption } from '../../../api/manager/school-manager-api/dtos/search-school-page-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { School } from './school.entity'

@Injectable()
export class SchoolService extends BaseService<School> {
  constructor(
    @InjectRepository(School)
    public repository: Repository<School>,
  ) {
    super(School, repository)
  }

  async getSchools(
    page_options_dto: SchoolOptionDto,
  ): Promise<PageDto<School>> {
    let query_builder = this.getRepository()
      .createQueryBuilder('s')
      .andWhere('s.active = true')

    if (page_options_dto.name) {
      query_builder = query_builder.andWhere(
        'LOWER(s.name) LIKE LOWER(:name)',
        { name: `%${page_options_dto.name}%` },
      )
    }

    if (page_options_dto.org_id) {
      query_builder = query_builder.andWhere('s.organizationId = :org_id', {
        org_id: page_options_dto.org_id,
      })
    }

    query_builder = query_builder
      .orderBy('s.createdAt', Order.ASC)
      .skip(calcSkip(page_options_dto.page, page_options_dto.take))
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async getTeachersCount(school_id: string): Promise<number> {
    const query_builder = this.getRepository()
      .createQueryBuilder('s')
      .select('COUNT(*)', 'teachers')
      .where('s.id = :school_id', { school_id })
      .innerJoin('s.teachers', 'users')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return (await query_builder.getRawOne()).teachers || 0
  }

  async getStudentsCount(school_id: string): Promise<number> {
    const query_builder = this.getRepository()
      .createQueryBuilder('s')
      .select('COUNT(*)', 'teachers')
      .where('s.id = :school_id', { school_id })
      .innerJoin('s.students', 'students')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return (await query_builder.getRawOne()).teachers || 0
  }

  async findByTeacher(
    page_options_dto: SearchSchoolPageOption,
    user_id: string,
  ): Promise<PageDto<School>> {
    const query_builder = this.applyOptionalFilters(
      this.getRepository()
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.teachers', 'users')
        .where('users.id = :user_id', { user_id })
        .andWhere('s.name ILIKE :name', {
          name: `%${page_options_dto.name || ''}%`,
        })
        .orderBy('s.createdAt', Order.ASC)
        .skip(page_options_dto.skip)
        .take(page_options_dto.take),
      page_options_dto,
    )

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<School>,
    filters: SearchSchoolPageOption,
  ): SelectQueryBuilder<School> {
    const { name } = filters
    if (name)
      query.andWhere(`course.name ILIKE :name`, {
        name: `%${name}%`,
      })
    return query
  }
}
