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
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Properties } from '@/modules/core/properties/properties.entity'
import { Role } from '@/modules/core/user/enums/role.enum'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'
import { MessageDto } from '@/utils/dtos/message.dto'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import { PageDto } from '../../../utils/dtos/page.dto'
import { PropertiesCreateOptions } from './dtos/properties.create.dto'
import { PropertiesearchOptions } from './dtos/properties.search.dto'
import { PropertiesApiService } from './properties-api.services'

@ApiTags('Properties API')
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/properties')
export class PropertiesApiController {
  constructor(private propertiesApiService: PropertiesApiService) {}

  @Get('/')
  async getProperties(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: PropertiesearchOptions,
  ): Promise<PageDto<Properties>> {
    return await this.propertiesApiService.getProperty(page_options_dto)
  }

  @Get('/user')
  async getUserProperties(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: PropertiesearchOptions,
  ): Promise<PageDto<Properties>> {
    return await this.propertiesApiService.getUserProperties(
      request.user?.studentID,
      page_options_dto,
    )
  }
  @Post('/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
  async addProperty(
    @Request() request: RequestWithMeta,
    @Body() body: PropertiesCreateOptions,
  ): Promise<MessageDto> {
    return await this.propertiesApiService.addProperty(body)
  }
  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
  async addLike(
    @Request() request: RequestWithMeta,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: PropertiesCreateOptions,
  ): Promise<MessageDto> {
    return await this.propertiesApiService.updateProperty(id, body)
  }
  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
  async deleteProperty(
    @Request() request: RequestWithMeta,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageDto> {
    return await this.propertiesApiService.deleteProperty(id)
  }
}
