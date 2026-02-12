import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { CreateSkillDto } from '../../../api/manager/skill-manager-api/dtos/create-skill.dto'
import { SkillSearchOptions } from '../../../api/manager/skill-manager-api/dtos/skill-search-option.dto'
import { UpdateSkillDto } from '../../../api/manager/skill-manager-api/dtos/update-skill.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Skill } from '../../core/skills/skill.entity'
import { SkillService } from '../../core/skills/skill.service'

@Injectable()
export class SkillManagerService {
  constructor(private skillService: SkillService) {}

  async getList(dto: SkillSearchOptions): Promise<PageDto<Skill>> {
    return await this.skillService.getList(dto)
  }

  async getById(id: string): Promise<Skill> {
    const skill = await this.skillService.findOne({ where: { id } })
    if (!skill) throw new NotFoundException("skill doesn't exist")
    return skill
  }

  async create(dto: CreateSkillDto): Promise<Skill> {
    const skill = await this.skillService.findOne({
      where: { name: dto.name },
    })
    if (skill) throw new ConflictException(`skill ${dto.name} already exist`)
    return await this.skillService.create(dto)
  }

  async update(id: string, dto: UpdateSkillDto): Promise<void> {
    await this.getById(id)
    await this.skillService.update(id, dto)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    await this.skillService.remove(id)
  }
}
