import { Module } from '@nestjs/common'

import { SkillManagerModule } from '../../../modules/managers/skill-manager/skill-manager.module'
import { SkillManagerApiController } from './skill-manager-api.controller'

@Module({
  imports: [SkillManagerModule],
  controllers: [SkillManagerApiController],
})
export class SkillManagerApiModule {}
