import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { AlreadyInDBError, NotInDBError } from '@/errors/errors'
import { ConsoleLoggerService } from '@/logger/console-logger.service'
import { UserRelationEnum } from '@/modules/core/user/user-relation.enum'
import { calcSkip } from '@/utils/paginatrion-skip'

import { UserOptionDto } from '../../../api/admin/user-api/dtos/user-options.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { User } from './user.entity'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly logger: ConsoleLoggerService,
    @InjectRepository(User)
    public repository: Repository<User>,
  ) {
    super(User, repository)
    this.logger.setContext(UserService.name)
  }

  async getUsers(page_options_dto: UserOptionDto): Promise<PageDto<User>> {
    let query_builder = this.applyOptionalFilters(
      this.getRepository().createQueryBuilder('u'),
      page_options_dto,
    )

    if (page_options_dto.name) {
      query_builder = query_builder.andWhere(
        'LOWER(u.first_name) LIKE LOWER(:name)',
        { name: `%${page_options_dto.name}%` },
      )
    }

    if (page_options_dto.school_id) {
      query_builder = query_builder.andWhere('u.school_id = :school_id', {
        school_id: page_options_dto.school_id,
      })
    }

    if (page_options_dto.org_id) {
      query_builder = query_builder.andWhere('u.organizationId = :org_id', {
        org_id: page_options_dto.org_id,
      })
    }

    if (page_options_dto.role) {
      query_builder = query_builder.andWhere('u.role = :role', {
        role: page_options_dto.role,
      })
    }

    if (page_options_dto.skipRole) {
      query_builder = query_builder.andWhere('u.role <> :role', {
        role: page_options_dto.skipRole,
      })
    }

    query_builder = query_builder
      .orderBy('u.createdAt', Order.ASC)
      .skip(calcSkip(page_options_dto.page, page_options_dto.take))
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async getBySchool(
    page_options_dto: PageOptionsDto,
    school_id: string,
  ): Promise<PageDto<User>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('u')
      .innerJoin('u.schools', 'schools')
      .where('schools.id = :school_id', { school_id })
      .andWhere('u.role = :role', { role: 'manager' })
      .orderBy('u.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  public async updateUserDetails(
    userId: string,
    {
      first_name,
      last_name,
      avatar,
    }: { first_name?: string; last_name?: string; avatar?: string },
  ): Promise<void> {
    const userRepo = this.getRepository()
    const user = await userRepo.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    await userRepo.update(
      { id: user.id },
      {
        first_name,
        last_name,
        avatar,
      },
    )

    return
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<User>,
    filters: UserOptionDto,
  ): SelectQueryBuilder<User> {
    const { name, email, role } = filters

    if (name && name.split(' ')[0]) {
      query.andWhere('u.first_name = :first_name', {
        first_name: name.split(' ')[0],
      })
    }

    if (name && name.split(' ')[1]) {
      query.andWhere('u.last_name = :last_name', {
        last_name: name.split(' ')[1],
      })
    }

    if (email) {
      query.andWhere('u.email = :email', { email })
    }

    if (role) {
      query.andWhere('u.role =  :role', { role })
    }

    return query
  }

  async createUser(
    email: string,
    username?: string,
    displayName?: string,
  ): Promise<User> {
    const user = User.create(email, username, displayName)
    try {
      return await this.getRepository().save(user)
    } catch {
      this.logger.debug(
        `A user with the username '${username}' already exists.`,
        'createUser',
      )
      throw new AlreadyInDBError(
        `A user with the username '${username}' already exists.`,
      )
    }
  }

  async deleteUser(user: User): Promise<void> {
    await this.getRepository().remove(user)
    this.logger.debug(
      `Successfully deleted user with username ${user.username}`,
      'deleteUser',
    )
  }

  async changeDisplayName(user: User, displayName: string): Promise<void> {
    user.displayName = displayName
    await this.getRepository().save(user)
  }

  async getUserByUsername(
    username: string,
    withRelations: UserRelationEnum[] = [],
  ): Promise<User> {
    const user = await this.getRepository().findOne({
      where: { username: username },
      relations: withRelations,
    })
    if (user === null) {
      throw new NotInDBError(`User with username '${username}' not found`)
    }
    return user
  }

  async getUserByEmail(
    email: string,
    withRelations: UserRelationEnum[] = [],
  ): Promise<User | null> {
    const user = await this.getRepository().findOne({
      where: { email: email },
      relations: withRelations,
    })

    return user
  }

  getAvatar(user: User): string {
    if (user.avatar) {
      return user.avatar
    } else {
      return ''
    }
  }

  async updateMetaFlag(
    userId: string,
    key: string,
    value: string | number | boolean,
  ): Promise<void> {
    const query_builder = this.getRepository()

    await query_builder
      .createQueryBuilder()
      .update()
      .set({
        meta: () =>
          `jsonb_set(meta, '{${key}}', '${JSON.stringify(value)}', true)`,
      })
      .where('id = :id', { id: userId })
      .execute()
  }
}
