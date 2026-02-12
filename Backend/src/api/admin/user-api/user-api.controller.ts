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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { Role } from '../../../modules/core/user/enums/role.enum'
import { User } from '../../../modules/core/user/user.entity'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { FILE_SCHEMA } from '../../../utils/file-schema'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../../utils/parser/parse-image.pipe'
import { CreateMemberDto } from './dtos/create-member.dto'
import { SubmiInviteDto } from './dtos/submit-invite.dto'
import { UpdateMemberDto } from './dtos/update-member.dto'
import { UserOptionDto } from './dtos/user-options.dto'
import { UserApiService } from './user-api.service'

@ApiTags('User API (Admin)')
@ApiBearerAuth()
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('admin/org/user')
export class OrganizationUserApiController {
  constructor(private userApiService: UserApiService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @ApiQuery({ name: 'name', type: 'string' })
  @ApiQuery({ name: 'email', type: 'string' })
  @ApiQuery({ name: 'school_id', type: 'string' })
  @ApiQuery({ name: 'role', enum: [Role.SuperAdmin, Role.Admin, Role.Manager] })
  async getUsers(
    @Query() page_options_dto: UserOptionDto,
    @Req() request: RequestWithMeta,
  ): Promise<PageDto<User>> {
    return await this.userApiService.getMembers({
      org_id: request.org_id,
      ...page_options_dto,
    } as UserOptionDto)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async createUser(
    @Req() request: RequestWithMeta,
    @Body() dto: CreateMemberDto,
  ): Promise<User> {
    return await this.userApiService.inviteMember(dto, request.org_id)
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
    return await this.userApiService.updateAvatar(
      id,
      file,
      request.org_id,
      request.user.id,
    )
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return await this.userApiService.getMember(id)
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async udpateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMemberDto,
    @Request() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.userApiService.updateMember(id, dto, request.user.id)
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async deleteUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.userApiService.deleteMemeber(id, request.user.id)
  }

  @Post('/submitInvite')
  async submitInviteUser(
    @Req() request: RequestWithMeta,
    @Body() dto: SubmiInviteDto,
  ): Promise<MessageDto> {
    return await this.userApiService.submitInvite(dto)
  }
}
