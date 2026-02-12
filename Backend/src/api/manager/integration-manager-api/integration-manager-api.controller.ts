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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Integration } from '../../../modules/core/integration/integration.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { IntegrationSearchOptions } from './dtos/content-integration-search-option.dto'
import { CreateIntegrationDto } from './dtos/create-content-integration.dto'
import { UpdateIntegrationDto } from './dtos/update-content-integration.dto'
import { IntegrationManagerApiService } from './integration-manager-api.service'

@ApiTags('Integrations API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/integration')
export class IntegrationManagerApiController {
  constructor(
    private integrationManagerApiService: IntegrationManagerApiService,
  ) {}

  @Get()
  async getContentIntegrationList(
    @Query() dto: IntegrationSearchOptions,
    @Req() req: RequestWithMeta,
  ): Promise<PageDto<Integration>> {
    return await this.integrationManagerApiService.getContentIntegrationList(
      dto,
      req.org_id,
      req.user?.role as Role,
    )
  }

  @Get('/:id')
  async getContentIntegration(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithMeta,
  ): Promise<Integration> {
    return await this.integrationManagerApiService.getContentIntegration(
      id,
      req.org_id,
      req.user?.role as Role,
    )
  }

  @Post()
  async createContentIntegration(
    @Body() dto: CreateIntegrationDto,
    @Req() req: RequestWithMeta,
  ): Promise<Integration> {
    return await this.integrationManagerApiService.createContentIntegration(
      dto,
      req.org_id,
    )
  }

  @Patch('/:id')
  async updateContentIntegration(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateIntegrationDto,
    @Req() req: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.integrationManagerApiService.updateContentIntegration(
      id,
      dto,
      req.org_id,
      req.user?.role as Role,
    )
  }

  @Delete('/:id')
  async removeContentIntegration(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.integrationManagerApiService.removeContentIntegration(
      id,
      req.org_id,
      req.user?.role as Role,
    )
  }
}
