import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { SchoolSocial } from '../../../modules/core/school-social/school-social.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { CreateSchoolSocialDto } from './dtos/create-school-social.dto'
import { UpdateSchoolSocialDto } from './dtos/update-school-social.dto'
import { SchoolSocialManagerApiService } from './school-social-manager-api.service'

@ApiTags('School Socials API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/school/:school_id')
export class SchoolSocialManagerApiController {
  constructor(
    private schoolSocialManagerApiService: SchoolSocialManagerApiService,
  ) {}

  @Post('/social')
  async createSocialLink(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Body() dto: CreateSchoolSocialDto,
  ): Promise<SchoolSocial> {
    return await this.schoolSocialManagerApiService.createSocialLink(
      school_id,
      dto,
    )
  }

  @Delete('/social/:social_id')
  async deleteSocialLink(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Param('social_id', new ParseUUIDPipe()) social_id: string,
  ): Promise<MessageDto> {
    return await this.schoolSocialManagerApiService.deleteSocialLink(
      school_id,
      social_id,
    )
  }

  @Patch('/social/:social_id')
  async updateSocialLink(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Param('social_id', new ParseUUIDPipe()) social_id: string,
    @Body() dto: UpdateSchoolSocialDto,
  ): Promise<MessageDto> {
    return await this.schoolSocialManagerApiService.updateSocialLink(
      school_id,
      social_id,
      dto,
    )
  }
}
