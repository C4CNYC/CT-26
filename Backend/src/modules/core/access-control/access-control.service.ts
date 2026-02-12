import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '@/utils/base/base.service'

import { AccessControlEntity } from './access-control.entity'

@Injectable()
export class AccessControlEntityService extends BaseService<AccessControlEntity> {
  constructor(
    @InjectRepository(AccessControlEntity)
    public repository: Repository<AccessControlEntity>,
  ) {
    super(AccessControlEntity, repository)
  }
  async getAllFeatures(): Promise<AccessControlEntity[]> {
    return await this.repository
      .createQueryBuilder('accessControl')
      .select('accessControl.feature', 'feature')
      .addSelect('COUNT(accessControl.id)', 'count')
      .groupBy('accessControl.feature')
      .getRawMany()
  }
  async getFeatureAccessesByUserId(id: string): Promise<AccessControlEntity[]> {
    return await this.repository.find({ where: { user: { id } } })
  }
}
