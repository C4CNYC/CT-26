import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { FILE_SCHEMA } from '@/utils/file-schema'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '@/utils/parser/parse-image.pipe'

import { Role } from '../../../modules/core/user/enums/role.enum'
import { UpdateOrganizationByOwnerDto } from './dtos/update-organization.dto'

@ApiTags('Organization API (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.Admin)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/org')
export class OrganizationApiController {
  constructor(private organizationMangerService: OrganizationManagerService) {}

  @Get()
  async getOrganization(@Req() req: RequestWithMeta): Promise<Organization> {
    return await this.organizationMangerService.getOrganizationByOwner(
      req.user.id,
    )
  }

  @Patch('/:id')
  async updateOrganizationByOwner(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateOrganizationByOwnerDto,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.updateOrganizationByOwner(
      id,
      req.user.id,
      data,
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

  @Patch('/:id/logo')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async updateLogo(
    @Req() req: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(new ParseImagePipe(200_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    console.log(file, 'FILE')
    return await this.organizationMangerService.uploadLogo(
      id,
      req.user.id,
      file,
    )
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
    @UploadedFile(new ParseImagePipe(200_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.organizationMangerService.uploadMiniLogo(
      id,
      req.user.id,
      file,
    )
  }
}
