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
  ApiTags,
} from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Media } from '../../../modules/core/media/media.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { CreateMediaDto } from './dtos/create-media.dto'
import { MediaSearchOptions } from './dtos/media-search-option.dto'
import { UpdateMediaPathDto } from './dtos/update-media-path.dto'
import { UpdateMediaDto } from './dtos/update-media.dto'
import { MediaManagerApiService } from './media-manager-api.service'

@ApiTags('Media API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/media')
export class MediaManagerApiController {
  constructor(private mediaManagerApiService: MediaManagerApiService) {}

  @Get()
  async getMediaList(
    @Request() request: RequestWithMeta,
    @Query() dto: MediaSearchOptions,
  ): Promise<PageDto<Media>> {
    return await this.mediaManagerApiService.getMediaList(dto, request.user.id)
  }

  @Get('/:id')
  async getMedia(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Media> {
    return await this.mediaManagerApiService.getMedia(id, request.user.id)
  }

  @Post()
  async createMedia(
    @Request() request: RequestWithMeta,
    @Body() dto: CreateMediaDto,
  ): Promise<Media> {
    return await this.mediaManagerApiService.createMedia(dto, request.user.id)
  }

  @Patch('/path')
  async updateMediaPath(@Body() dto: UpdateMediaPathDto): Promise<MessageDto> {
    return await this.mediaManagerApiService.updateMediaPath(
      dto.path,
      dto.newPath,
    )
  }

  @Patch('/:id')
  async updateMedia(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMediaDto,
  ): Promise<MessageDto> {
    return await this.mediaManagerApiService.updateMedia(id, dto)
  }

  @Delete('/:id')
  async removeMedia(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.mediaManagerApiService.removeMedia(id)
  }
  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Request() request: RequestWithMeta,
    @UploadedFile(new ParseImagePipe(20_000_000))
    file: Express.Multer.File,
  ) {
    return await this.mediaManagerApiService.uploadMediaFile(
      file,
      request.user.id,
    )
  }
}
