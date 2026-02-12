import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { OrganizationSearchOptions } from '@/api/super-admin/organization-api/dtos/organization-search-options.dto'
import { BaseService } from '@/utils/base/base.service'
import { Order } from '@/utils/constants/order.enum'
import { PageMetaDto } from '@/utils/dtos/page-meta.dto'
import { PageDto } from '@/utils/dtos/page.dto'

import { CatalogCourseService } from '../catalog-course/catalog-course.service'
import { CourseService } from '../course/course.service'
import { UserService } from '../user/user.service'
import { Organization } from './organization.entity'

@Injectable()
export class OrganizationService extends BaseService<Organization> {
  constructor(
    @InjectRepository(Organization)
    public repository: Repository<Organization>,
    private courseService: CourseService,
    private catalogCourseService: CatalogCourseService,
    private userService: UserService,
  ) {
    super(Organization, repository)
  }

  async getList(
    page_options_dto: OrganizationSearchOptions,
    org_id?: string,
  ): Promise<PageDto<Organization>> {
    const query_builder = this.getRepository().createQueryBuilder('org')

    if (org_id) {
      query_builder.where('org.id = :org_id', { org_id })
    }

    this.applyOptionalFilters(query_builder, page_options_dto)
      .leftJoinAndSelect('org.owner', 'owner')
      .orderBy('org.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Organization>,
    filters: OrganizationSearchOptions,
  ): SelectQueryBuilder<Organization> {
    const { name } = filters

    if (name) {
      query.andWhere(`org.name ILIKE :name`, {
        name: `%${name}%`,
      })
    }

    return query
  }

  async createOrganizationWithCatalog(
    data: Partial<Organization>,
    ownerId?: string,
  ): Promise<Organization> {
    const org = await this.create(data)

    if (ownerId) {
      const owner = await this.userService.findOne({
        where: { id: ownerId },
      })

      if (!owner) {
        throw new NotFoundException(`User with id ${ownerId} not found`)
      }

      org.owner = owner
      await this.repository.save(org)
    }

    const global_courses = await this.courseService.find({ is_global: true })

    const catalog_entries = global_courses.map((course) => ({
      organization_id: org.id,
      course_id: course.id,
      is_show: true,
    }))
    if (catalog_entries.length) {
      await this.catalogCourseService.repository.save(catalog_entries)
    }

    return org
  }
}
