import { Module } from '@nestjs/common'

import { IntegrationManagerModule } from '../../../modules/managers/content-integration-manager/content-integration-manager.module'
import { LessonContentManagerModule } from '../../../modules/managers/lesson-content-manager/lesson-content-manager.module'
import { LessonManagerModule } from '../../../modules/managers/lesson-manager/lesson-manager.module'
import { SkillManagerModule } from '../../../modules/managers/skill-manager/skill-manager.module'
import { UserModule } from './../../../modules/core/user/user.module'
import { LessonManagerApiController } from './lesson-manager-api.controller'
import { LessonManagerApiService } from './lesson-manager-api.service'
import { LessonPublicApiController } from './lesson-public-api.controller'
import { EnvironmentsModule } from '../environments/environments.module'

@Module({
  imports: [
    LessonManagerModule,
    SkillManagerModule,
    IntegrationManagerModule,
    UserModule,
    LessonContentManagerModule,
    EnvironmentsModule,
  ],
  providers: [LessonManagerApiService],
  controllers: [LessonManagerApiController, LessonPublicApiController],
})
export class LessonManagerApiModule {}
