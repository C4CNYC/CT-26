import { Injectable } from '@nestjs/common'
import { UpdateResult } from 'typeorm'

import { AccessControlEntity } from '@/modules/core/access-control/access-control.entity'
import { AccessControlEntityService } from '@/modules/core/access-control/access-control.service'

import { AccessControlUpdateDto } from './access-control-update.dto'

@Injectable()
export class AccessControlManagerService {
  constructor(private featureService: AccessControlEntityService) {}
  async getAllFeatures(): Promise<AccessControlEntity[]> {
    return await this.featureService.getAllFeatures()
  }
  async getByUserId(userId: string): Promise<AccessControlEntity[]> {
    return await this.featureService.getFeatureAccessesByUserId(userId)
  }
  async setToUserId(
    userId: string,
    acDTO: AccessControlUpdateDto,
  ): Promise<UpdateResult | AccessControlEntity> {
    const featureAccess = await this.featureService.findOne({
      where: {
        user: { id: userId },
        feature: acDTO.feature,
      },
    })
    if (featureAccess) {
      return await this.featureService.update(featureAccess.id, {
        maxUsageCount: acDTO.maxUsageCount + featureAccess.maxUsageCount,
      })
    } else {
      return await this.featureService.create({
        ...acDTO,
        user: { id: userId },
      })
    }
  }
  async decreaseToUserId(userId: string, featureName: string): Promise<number> {
    const featureAccess = await this.featureService.findOne({
      where: {
        user: { id: userId },
        feature: featureName,
      },
    })
    if (!featureAccess || featureAccess.maxUsageCount === 0) {
      return 0
    }
    await this.featureService.update(featureAccess.id, {
      maxUsageCount: featureAccess.maxUsageCount - 1,
    })
    return featureAccess.maxUsageCount - 1
  }
}
