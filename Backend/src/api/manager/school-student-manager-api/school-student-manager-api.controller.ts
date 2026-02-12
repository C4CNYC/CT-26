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

import { Student } from '../../../modules/core/student/student.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { CreateStudentDto } from './dtos/create-student.dto'
import { InviteStudentDto } from './dtos/invite-student.dto'
import { ResetStudentPasswordDto } from './dtos/reset-student-password.dto'
import { SchoolSearchOptions } from './dtos/school-search-options.dto'
import { UpdateStudentDto } from './dtos/update-student.dto'
import { SchoolStudentManagerApiService } from './school-student-manager-api.service'

@ApiTags('School Students API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/school/:school_id/student')
export class SchoolStudentManagerApiController {
  constructor(
    private schoolStudentManagerApiService: SchoolStudentManagerApiService,
  ) {}

  @Get()
  async getStudents(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Query() dto: SchoolSearchOptions,
  ): Promise<PageDto<Student>> {
    return await this.schoolStudentManagerApiService.getStudents(school_id, dto)
  }

  @Get('/:id')
  async getStudent(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Student> {
    return await this.schoolStudentManagerApiService.getStudent(id)
  }

  @Post()
  async createStudent(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Body() dto: CreateStudentDto,
    @Req() req: RequestWithMeta,
  ): Promise<Student> {
    return await this.schoolStudentManagerApiService.createStudent(
      school_id,
      dto,
      req.org_name,
    )
  }

  @Post('/invite')
  async inviteStudent(
    @Param('school_id', new ParseUUIDPipe()) school_id: string,
    @Body() dto: InviteStudentDto,
    @Request() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.schoolStudentManagerApiService.inviteStudent(
      school_id,
      dto,
      request.org_id,
    )
  }

  @Patch('/:id')
  async updateStudent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<MessageDto> {
    return await this.schoolStudentManagerApiService.updateStudent(id, dto)
  }

  @Patch('/:id/password')
  async resetStudentPassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ResetStudentPasswordDto,
  ): Promise<MessageDto> {
    return await this.schoolStudentManagerApiService.ResetStudentPassword(
      id,
      dto,
    )
  }

  @Patch('/:id/avatar')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async updateAvatar(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(new ParseImagePipe(200_000))
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    return await this.schoolStudentManagerApiService.updateAvatar(
      id,
      file,
      request.org_id,
    )
  }

  @Delete('/:id')
  async deleteStudent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.schoolStudentManagerApiService.deleteStudent(
      id,
      req.org_name,
    )
  }
}
