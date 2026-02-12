import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Skill } from '../../../modules/core/skills/skill.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { SkillManagerService } from '../../../modules/managers/skill-manager/skill-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CreateSkillDto } from './dtos/create-skill.dto'
import { SkillSearchOptions } from './dtos/skill-search-option.dto'
import { UpdateSkillDto } from './dtos/update-skill.dto'

@ApiTags('Skills API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/skill')
export class SkillManagerApiController {
  constructor(private skillManagerApiService: SkillManagerService) {}
  @Get()
  async getSkillList(
    @Query() dto: SkillSearchOptions,
  ): Promise<PageDto<Skill>> {
    return await this.skillManagerApiService.getList(dto)
  }

  @Get('/:id')
  async getSkill(@Param('id', new ParseUUIDPipe()) id: string): Promise<Skill> {
    return await this.skillManagerApiService.getById(id)
  }

  @Post()
  async createSkill(@Body() dto: CreateSkillDto): Promise<Skill> {
    return await this.skillManagerApiService.create(dto)
  }

  @Patch('/:id')
  async updateSkill(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSkillDto,
  ): Promise<MessageDto> {
    await this.skillManagerApiService.update(id, dto)
    return new MessageDto('skill udpated')
  }

  @Delete('/:id')
  async removeSkill(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    await this.skillManagerApiService.remove(id)
    return new MessageDto('skill removed')
  }
}
