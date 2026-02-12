import { Injectable } from '@nestjs/common'

import { PropertiesCreateOptions } from '@/api/admin/properties/dtos/properties.create.dto'
import { PropertiesearchOptions } from '@/api/admin/properties/dtos/properties.search.dto'
import { Properties } from '@/modules/core/properties/properties.entity'
import { Propertieservice } from '@/modules/core/properties/properties.service'

import { PageDto } from '../../../utils/dtos/page.dto'

@Injectable()
export class PropertiesManagerService {
  constructor(private readonly propertieservice: Propertieservice) {}

  getProperties(
    page_options_dto: PropertiesearchOptions,
  ): Promise<PageDto<Properties>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.propertieservice.getList(page_options_dto)
  }
  addProperty(property: PropertiesCreateOptions) {
    const newProperty: Properties = new Properties()
    ;(newProperty.entityType = property.entityType),
      (newProperty.entityId = property.entityId),
      (newProperty.propertyName = property.propertyName),
      (newProperty.propertyValue = property.propertyValue)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.propertieservice.create(newProperty)
  }
  removeProperty(propertyId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.propertieservice.remove(propertyId)
  }
  update(propertyId: string, property: PropertiesCreateOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.propertieservice.update(propertyId, property)
  }
}
