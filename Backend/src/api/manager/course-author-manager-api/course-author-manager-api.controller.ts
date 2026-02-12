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

import { CourseAuthor } from '../../../modules/core/course-authors/course-authors.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { CourseAuthorManagerApiService } from './course-author-manager-api.service'
import { CourseAuthorSearchOptions } from './dtos/course-author-search-option.dto'
import { CreateCourseAuthorDto } from './dtos/create-course-author.dto'
import { UpdateCourseAuthorDto } from './dtos/update-course-author.dto'

@ApiTags('Course Author API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/author')
export class CourseAuthorManagerApiController {
  constructor(
    private courseAuthorManagerApiService: CourseAuthorManagerApiService,
  ) {}
  @Get()
  async getCourseAuthorList(
    @Query() dto: CourseAuthorSearchOptions,
  ): Promise<PageDto<CourseAuthor>> {
    return await this.courseAuthorManagerApiService.getCourseAuthorList(dto)
  }

  @Get('/:id')
  async getCourseAuthor(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseAuthor> {
    return await this.courseAuthorManagerApiService.getCourseAuthor(id)
  }

  @Post()
  async createCourseAuthor(
    @Body() dto: CreateCourseAuthorDto,
  ): Promise<CourseAuthor> {
    return await this.courseAuthorManagerApiService.createCourseAuthor(dto)
  }

  @Patch('/:id')
  async updateCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCourseAuthorDto,
  ): Promise<MessageDto> {
    return await this.courseAuthorManagerApiService.updateCourseAuthor(id, dto)
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
    return await this.courseAuthorManagerApiService.updateAvatar(
      id,
      file,
      request.org_id,
    )
  }

  @Delete('/:id')
  async removeCourseAuthor(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.courseAuthorManagerApiService.removeCourseAuthor(id)
  }
}
