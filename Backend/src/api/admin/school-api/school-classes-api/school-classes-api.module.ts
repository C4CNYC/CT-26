import { Module } from '@nestjs/common'

import { ClassModule } from '../../../../modules/core/class/class.module'
import { SchoolModule } from '../../../../modules/core/school/school.module'
import { SchoolMangerModule } from '../../../../modules/managers/school-manager/school-manager.module'
import { SchoolClassesApiController } from './school-classes-api.controller'
import { SchoolClassesApiService } from './school-classes-api.service'

@Module({
  imports: [ClassModule, SchoolModule, SchoolMangerModule],
  providers: [SchoolClassesApiService],
  controllers: [SchoolClassesApiController],
})
export class SchoolClassesApiModule {}
