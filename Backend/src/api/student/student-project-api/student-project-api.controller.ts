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

import { StudentProject } from '../../../modules/core/student-project/student-project.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { CreateProjectDto } from './dtos/create-project.dto'
import { MyPublicProjectSearchOptions } from './dtos/public-project-search.dto'
import { MyProjectSearchOptions } from './dtos/search-project.dto'
import { UpdateProjectDto } from './dtos/update-project.dto'
import { StudentProjectApiService } from './student-project-api.services'

@ApiTags('Project API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/project')
export class StudenProjectApiController {
  constructor(private studentProjectApiService: StudentProjectApiService) {}

  @Get()
  async getProjectList(
    @Request() request: RequestWithMeta,
    @Query() dot: MyProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
    return await this.studentProjectApiService.getProjectList(
      request.user.studentID,
      dot,
    )
  }

  @Get('public')
  async getPublicProjectList(
    @Query() dot: MyPublicProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
    return await this.studentProjectApiService.getPublicProjectList(dot)
  }

  @Get(':id')
  async getProject(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StudentProject> {
    return await this.studentProjectApiService.getProject(
      id,
      request.user.studentID,
    )
  }

  @Post()
  async createProject(
    @Request() request: RequestWithMeta,
    @Body() dto: CreateProjectDto,
  ): Promise<StudentProject> {
    return await this.studentProjectApiService.create(
      dto,
      request.user.studentID,
    )
  }

  @Patch(':id')
  async updateProject(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<MessageDto> {
    return await this.studentProjectApiService.update(
      id,
      request.user.studentID,
      dto,
    )
  }

  @Patch('/:id/cover')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async uploadCover(
    @UploadedFile(new ParseImagePipe(2_000_000))
    file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.studentProjectApiService.updateCover(
      id,
      file,
      request.org_id,
      request.user.studentID,
    )
  }

  @Patch('/:id/avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async uploadAvatar(
    @UploadedFile(new ParseImagePipe(2_000_000))
    file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.studentProjectApiService.updateAvatar(
      id,
      file,
      request.org_id,
      request.user.studentID,
    )
  }

  @Delete(':id')
  async removeProject(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.studentProjectApiService.remove(
      id,
      request.user.studentID,
    )
  }
}
