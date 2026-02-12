import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { SchoolContact } from '../../../modules/core/school-contact/school-contact.entity'
import { SchoolSetting } from '../../../modules/core/school-setting/school-setting.entity'
import { School } from '../../../modules/core/school/school.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { SchoolMangerService } from '../../../modules/managers/school-manager/school-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { SchoolStatistic } from '../../../utils/interfaces/school-statistic.dto'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { SearchSchoolPageOption } from './dtos/search-school-page-option.dto'
import { UpdateSchoolContactDto } from './dtos/update-school-contact.dto'
import { UpdateSchoolSettingDto } from './dtos/update-school-setting.dto'
import { UpdateSchoolDto } from './dtos/update-school.dto'
import { SchoolManagerApiService } from './school-manager-api.service'

@ApiTags('School API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/school')
export class SchoolManagerApiController {
  constructor(
    private schoolManagerService: SchoolMangerService,
    private schoolManagerApiService: SchoolManagerApiService,
  ) {}

  @Patch('/:id/avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async uploadAvatar(
    @UploadedFile(new ParseImagePipe(200_000))
    file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.schoolManagerApiService.updateAvatar(
      id,
      file,
      request.org_id,
    )
  }

  @Patch('/:id/cover')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async uploadCover(
    @UploadedFile(new ParseImagePipe(1_000_000))
    file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.schoolManagerApiService.updateCover(
      id,
      file,
      request.org_id,
    )
  }

  @Get()
  async mySchools(
    @Query() dto: SearchSchoolPageOption,
    @Req() request: RequestWithMeta,
  ): Promise<PageDto<School>> {
    return await this.schoolManagerService.getMySchools(
      dto,
      request.user.id,
      request.org_id,
    )
  }

  @Get('/:school_id')
  async getSchool(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
  ): Promise<School & SchoolStatistic> {
    return await this.schoolManagerService.getSchool(school_id)
  }

  @Get('/:school_id/contact')
  async getContact(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
  ): Promise<SchoolContact> {
    return await this.schoolManagerService.getContact(school_id)
  }

  @Get('/:school_id/setting')
  async getSetting(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
  ): Promise<SchoolSetting> {
    return await this.schoolManagerService.getSetting(school_id)
  }

  @Patch('/:school_id')
  async updateSchool(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Body() dto: UpdateSchoolDto,
  ): Promise<MessageDto> {
    return await this.schoolManagerService.updateSchool(school_id, dto)
  }

  @Patch('/:school_id/setting')
  async updateSetting(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Body() dto: UpdateSchoolSettingDto,
  ): Promise<MessageDto> {
    return await this.schoolManagerService.updateSetting(school_id, dto)
  }

  @Patch('/:school_id/contact')
  async updateContacts(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Body() dto: UpdateSchoolContactDto,
  ): Promise<MessageDto> {
    return await this.schoolManagerService.updateContact(school_id, dto)
  }
}
