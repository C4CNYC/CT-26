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

import { Course } from '../../../modules/core/course/course.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { CourseManagerApiService } from './course-manager-api.service'
import { AddModuleToCourseDto } from './dtos/add-module-to-course.dto'
import { CourseSearchOptions } from './dtos/course-search-option.dto'
import { CreateCourseDto } from './dtos/create-course.dto'
import { RemoveModuleFromCourseDto } from './dtos/remove-module-from-course.dto'
import { UpdateCoursetDto } from './dtos/update-course.dto'

@ApiTags('Course API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/course')
export class CourseManagerApiController {
  constructor(private courseManagerApiService: CourseManagerApiService) {}
  @Get()
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
  async getCourseList(
    @Query() dto: CourseSearchOptions,
    @Request() request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerApiService.getCourseList(dto, request)
  }

  @Get('/public')
  async getPublicCourseList(
    @Query() dto: CourseSearchOptions,
    @Request() request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerApiService.getPublicCourseList(dto, request)
  }

  @Get('/catalog')
  async getCatalogCourseList(
    @Query() dto: CourseSearchOptions,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerApiService.getCatalogCourseList(dto)
  }

  @Get('/own')
  async getOwnCourseList(
    @Query() dto: CourseSearchOptions,
    @Request() request: RequestWithMeta,
  ): Promise<PageDto<Course>> {
    return await this.courseManagerApiService.getOwnCourseList(dto, request)
  }

  @Get('/:id')
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
  async getCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Course> {
    return await this.courseManagerApiService.getCourse(id)
  }

  @Post()
  @Roles(Role.SuperAdmin, Role.Admin, Role.Manager)
  async createCourse(
    @Body() dto: CreateCourseDto,
    @Request() request: RequestWithMeta,
  ): Promise<Course> {
    return await this.courseManagerApiService.createCourse(dto, request)
  }

  @Patch('/:id')
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
  async updateCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCoursetDto,
    @Request() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.courseManagerApiService.updateCourse(
      id,
      dto,
      request.org_id,
    )
  }

  @Patch('/:id/cover')
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  async updateCover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() request: RequestWithMeta,
    @UploadedFile(new ParseImagePipe(20_000_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.courseManagerApiService.updateCover(
      id,
      file,
      request.org_id,
    )
  }

  @Delete('/:id')
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
  async removeCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.courseManagerApiService.removeCourse(id)
  }

  @Patch('/:id/unit')
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
  async addModule(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddModuleToCourseDto,
  ): Promise<MessageDto> {
    return await this.courseManagerApiService.addUnit(id, dto)
  }

  @Delete('/:id/unit')
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
  async deleteModule(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: RemoveModuleFromCourseDto,
  ): Promise<MessageDto> {
    return await this.courseManagerApiService.removeUnit(id, dto)
  }
}
