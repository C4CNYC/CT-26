import {
  BadRequestException,
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
import { AuthUser } from '@/old-auth/decorators/user.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { CourseUnit } from '../../../modules/core/course-unit/course-unit.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { ValidateDurationPipe } from '../../../utils/validators/validate-duration.pipe'
import { CourseUnitManagerApiService } from './course-unit-manager-api.service'
import { AddLessonToModuleDto } from './dtos/add-lesson-to-module.dto'
import { CourseUnitSearchOptions } from './dtos/course-unit-search-option.dto'
import { CreateCourseUnitDto } from './dtos/create-course-unit.dto'
import { RemoveLessonFromModuleDto } from './dtos/remove-lesson-from-module.dto'
import { UpdateCourseUnitDto } from './dtos/update-course-unit.dto'
import { UpdateModuleLessonDto } from './dtos/update-module-lesson.dto'

@ApiTags('Course Unit API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/module')
export class CourseUnitManagerApiController {
  constructor(
    private courseUnitManagerApiService: CourseUnitManagerApiService,
  ) {}
  @Get()
  async getCourseUnitList(
    @Query() dto: CourseUnitSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<CourseUnit>> {
    console.log('getCourseUnitList Manager', dto.take)
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.courseUnitManagerApiService.getCourseUnitList(userId, dto)
  }

  @Get('/catalog')
  async getCatalogCourseUnitList(
    @Request() request: RequestWithMeta,
    @Query() dto: CourseUnitSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<CourseUnit>> {
    return await this.courseUnitManagerApiService.getCatalogCourseUnitList(
      userId,
      dto,
      request.school_id,
    )
  }

  @Get('/own')
  async getOwnCourseUnitList(
    @Query() dto: CourseUnitSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<CourseUnit>> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.courseUnitManagerApiService.getOwnCourseUnitList(
      userId,
      dto,
    )
  }

  @Get('/:id')
  async getCourseUnit(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseUnit> {
    return await this.courseUnitManagerApiService.getCourseUnit(id)
  }

  @Post()
  async createCourseUnit(
    @Request() request: RequestWithMeta,
    @Body() createDto: CreateCourseUnitDto,
    @AuthUser() userId: string,
  ): Promise<CourseUnit> {
    if (!userId) {
      throw new BadRequestException(
        'Authentication token is invalid or missing.',
      )
    }
    return await this.courseUnitManagerApiService.createCourseUnit(
      userId,
      createDto,
      request.school_id,
    )
  }

  @Patch('/:id')
  async updateCourseUnit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateDurationPipe()) dto: UpdateCourseUnitDto,
  ): Promise<MessageDto> {
    return await this.courseUnitManagerApiService.updateCourseUnit(id, dto)
  }

  @Patch('/:id/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() request: RequestWithMeta,
    @UploadedFile(new ParseImagePipe(20_000_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.courseUnitManagerApiService.updateAvatar(
      id,
      file,
      request.org_id,
    )
  }

  @Patch('/:id/background')
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('background'))
  async updateBackground(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() request: RequestWithMeta,
    @UploadedFile(new ParseImagePipe(20_000_000))
    background: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.courseUnitManagerApiService.updateBackground(
      id,
      background,
      request.org_id,
    )
  }

  @Delete('/:id')
  async removeCourseUnit(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.courseUnitManagerApiService.removeCourseUnit(id)
  }

  @Post('/:id/lesson')
  async addLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddLessonToModuleDto,
  ): Promise<MessageDto> {
    return await this.courseUnitManagerApiService.addLesson(id, dto)
  }

  @Delete('/:id/lesson')
  async deleteLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: RemoveLessonFromModuleDto,
  ): Promise<MessageDto> {
    return await this.courseUnitManagerApiService.removeLesson(id, dto)
  }

  @Patch('/:id/lesson')
  async updateLesson(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateModuleLessonDto,
  ): Promise<MessageDto> {
    return await this.courseUnitManagerApiService.updateLesson(id, dto)
  }
}
