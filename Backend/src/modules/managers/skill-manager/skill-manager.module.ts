import { Module } from '@nestjs/common'

import { SkillModule } from '../../core/skills/skill.module'
import { SkillManagerService } from './skill-manager.service'

@Module({
  imports: [SkillModule],
  providers: [SkillManagerService],
  exports: [SkillManagerService],
})
export class SkillManagerModule {}
