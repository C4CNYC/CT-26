import { Module } from '@nestjs/common'

import { SchoolClassManagerModule } from '../../../modules/managers/school-class-manager/school-class-manager.module'
import { ClassPublicApiController } from './class-public-api.controller'

@Module({
  imports: [SchoolClassManagerModule],
  controllers: [ClassPublicApiController],
})
export class ClassPublicApiModule {}
