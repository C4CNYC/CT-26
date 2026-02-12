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
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Class } from '../../../modules/core/class/class.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { User } from '../../../modules/core/user/user.entity'
import { ClassMentorManagerService } from '../../../modules/managers/class-mentor-manager/class-mentor-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { AddCourseToClassDto } from './dtos/add-course-to-class.dto'
import { AddMentorToClassDto } from './dtos/add-mentor-to-class.dto'
import { ClassSearchOptions } from './dtos/class-search-option.dto'
import { CreateClassDto } from './dtos/create-class.dto'
import { RemoveCourseFromClassDto } from './dtos/remove-course-from-class.dto'
import { RemoveMentorFromClassDto } from './dtos/remove-mentor-from-class.dto'
import { UpdateClassSettingDto } from './dtos/update-class-setting.dto'
import { UpdateClassDto } from './dtos/update-class.dto'
import { SchoolClassManagerApiService } from './school-class-manager-api.service'

@ApiTags('School Class API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/school/:school_id/class')
export class SchoolClassManagerApiController {
  constructor(
    private schoolClassManagerApiService: SchoolClassManagerApiService,
    private classMentorManagerService: ClassMentorManagerService,
  ) {}

  @Get()
  async getClasses(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Query() page_options_dto: PageOptionsDto & ClassSearchOptions,
  ): Promise<PageDto<Class>> {
    return await this.schoolClassManagerApiService.getClasses(
      school_id,
      page_options_dto,
    )
  }

  @Get(':class_id/mentor')
  async getMentors(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
  ): Promise<User[]> {
    return await this.classMentorManagerService.getClassMentors(class_id)
  }

  @Get('/:class_id')
  async getClass(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
  ): Promise<Class> {
    return await this.schoolClassManagerApiService.getClass(class_id)
  }

  @Post()
  async createClass(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Request() request: RequestWithMeta,
    @Body() dto: CreateClassDto,
  ): Promise<Class> {
    return await this.schoolClassManagerApiService.createClass(
      school_id,
      request.org_id,
      dto,
    )
  }

  @Patch('/:class_id')
  async updateClass(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: UpdateClassDto,
  ): Promise<MessageDto> {
    return await this.schoolClassManagerApiService.updateClass(class_id, dto)
  }

  @Patch('/:class_id/setting')
  async updateClassSetting(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: UpdateClassSettingDto,
  ): Promise<MessageDto> {
    return await this.schoolClassManagerApiService.updateClassSetting(
      class_id,
      dto,
    )
  }

  @Patch('/:class_id/avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async uploadAvatar(
    @UploadedFile(new ParseImagePipe(2_000_000))
    file: Express.Multer.File,
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Param('class_id', new ParseUUIDPipe()) id: string,
    @Req() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.schoolClassManagerApiService.updateAvatar(
      id,
      file,
      request.org_id,
    )
  }

  @Delete('/:class_id')
  async removeClass(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
  ): Promise<MessageDto> {
    return await this.schoolClassManagerApiService.removeClass(class_id)
  }

  @Patch('/:class_id/course')
  async addModule(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: AddCourseToClassDto,
  ): Promise<MessageDto> {
    return await this.schoolClassManagerApiService.addCourse(class_id, dto)
  }

  @Delete('/:class_id/course')
  async removeModule(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: RemoveCourseFromClassDto,
  ): Promise<MessageDto> {
    return await this.schoolClassManagerApiService.removeCourse(class_id, dto)
  }

  @Patch('/:class_id/mentor')
  async addMentor(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: AddMentorToClassDto,
  ): Promise<MessageDto> {
    await this.classMentorManagerService.addMentorToClass(class_id, dto)
    return new MessageDto('mentor added')
  }

  @Delete('/:class_id/mentor')
  async removeMentor(
    @Param('class_id', new ParseUUIDPipe()) class_id: string,
    @Body() dto: RemoveMentorFromClassDto,
  ): Promise<MessageDto> {
    await this.classMentorManagerService.removeMentorFromClass(class_id, dto)
    return new MessageDto('mentor removed')
  }
}
