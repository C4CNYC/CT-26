import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Properties } from './properties.entity'
import { Propertieservice } from './properties.service'

@Module({
  imports: [TypeOrmModule.forFeature([Properties])],
  providers: [Propertieservice],
  exports: [Propertieservice],
})
export class PropertiesModule {}
