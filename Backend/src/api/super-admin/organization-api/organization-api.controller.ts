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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Organization } from '@/modules/core/organization/organization.entity'
import { OrganizationManagerService } from '@/modules/managers/organization-manger/organization-manger.service'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'
import { MessageDto } from '@/utils/dtos/message.dto'
import { PageDto } from '@/utils/dtos/page.dto'
import { FILE_SCHEMA } from '@/utils/file-schema'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '@/utils/parser/parse-image.pipe'

import { Role } from '../../../modules/core/user/enums/role.enum'
import { CreateOrganizationDto } from './dtos/create-organization.dto'
import { OrganizationSearchOptions } from './dtos/organization-search-options.dto'
import { UpdateOrganizationOwnerDto } from './dtos/update-organization-owner.dto'
import { UpdateOrganizationDto } from './dtos/update-organization.dto'

@ApiTags('Organization API (Super Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('super-admin/org')
export class OrganizationApiController {
  constructor(private organizationMangerService: OrganizationManagerService) {}

  @Get()
  async getOrganizations(
    @Req() { user, org_id }: RequestWithMeta,
    @Query() pageOptionsDto: OrganizationSearchOptions,
  ): Promise<PageDto<Organization>> {
    switch (user.role) {
      case Role.SuperAdmin:
        return await this.organizationMangerService.getList(pageOptionsDto)
      default:
      case Role.Admin:
        return await this.organizationMangerService.getList(
          pageOptionsDto,
          org_id,
        )
    }
  }

  @Get('/:id')
  async getOrganization(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Organization> {
    return await this.organizationMangerService.getOne(id)
  }

  @Post()
  async createOrganization(
    @Body() data: CreateOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationMangerService.createOrganization(data)
  }

  @Patch('/:id')
  async updateOrganization(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateOrganizationDto,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.updateOrganization(id, data)
  }

  @Patch('/:id/owner')
  async updateOrganizationOwner(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateOrganizationOwnerDto,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.updateOrganizationOwner(
      id,
      data.user_id,
    )
  }

  @Patch('/:id/favicon')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async updateFavicon(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(new ParseImagePipe(200_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.uploadFavicon(
      id,
      req.user.id,
      file,
    )
  }

  @Delete('/:id/favicon')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async deleteFavicon(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.deleteFavicon(id, req.user.id)
  }

  @Patch('/:id/logo')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async updateLogo(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe())
    id: string,
    @UploadedFile(new ParseImagePipe(200_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.uploadLogo(
      id,
      req.user.id,
      file,
    )
  }

  @Delete('/:id/logo')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async deleteLogo(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.deleteLogo(id, req.user.id)
  }

  @Patch('/:id/mini-logo')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async updateMiniLogo(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(new ParseImagePipe(200_000)) file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.uploadMiniLogo(
      id,
      req.user.id,
      file,
    )
  }

  @Delete('/:id/mini-logo')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async deleteMiniLogo(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.deleteMiniLogo(id, req.user.id)
  }

  @Delete('/:id/owner')
  async removeOrganizationOwner(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.removeOrganizationOwner(id)
  }

  @Delete('/:id')
  async deleteOrganization(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.deleteOrganization(id)
  }
}
