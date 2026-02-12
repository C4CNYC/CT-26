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

import { CourseUnitAuthor } from '../../../modules/core/course-unit-authors/course-unit-authors.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { CourseUnitAuthorManagerApiService } from './course-unit-author-manager-api.service'
import { CreateUnitAuthorDto } from './dtos/create-unit-author.dto'
import { UnitAuthorSearchOptions } from './dtos/unit-author-search-option.dto'
import { UpdateUnitAuthorDto } from './dtos/update-unit-author.dto'

@ApiTags('Course-Unit Author API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/unit-author')
export class CourseUnitAuthorManagerApiController {
  constructor(
    private unitAuthorManagerApiService: CourseUnitAuthorManagerApiService,
  ) {}
  @Get()
  async getCourseUnitAuthorList(
    @Query() dto: UnitAuthorSearchOptions,
  ): Promise<PageDto<CourseUnitAuthor>> {
    console.log('getCourseUnitAuthorList', dto)

    return await this.unitAuthorManagerApiService.getCourseUnitAuthorList(dto)
  }

  @Get('/:id')
  async getCourseUnitAuthor(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseUnitAuthor> {
    return await this.unitAuthorManagerApiService.getCourseUnitAuthor(id)
  }

  @Post()
  async createCourseUnitAuthor(
    @Body() dto: CreateUnitAuthorDto,
  ): Promise<CourseUnitAuthor> {
    return await this.unitAuthorManagerApiService.createCourseUnitAuthor(dto)
  }

  @Patch('/:id')
  async updateCourseUnit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUnitAuthorDto,
  ): Promise<MessageDto> {
    return await this.unitAuthorManagerApiService.updateCourseUnitAuthor(
      id,
      dto,
    )
  }

  @Patch('/:id/cover')
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  async updateCover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() request: RequestWithMeta,
    @UploadedFile(new ParseImagePipe(20_000_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.unitAuthorManagerApiService.updateAvatar(
      id,
      file,
      request.org_id,
    )
  }

  @Delete('/:id')
  async removeCourseUnitAuthor(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.unitAuthorManagerApiService.removeCourseUnitAuthor(id)
  }
}
