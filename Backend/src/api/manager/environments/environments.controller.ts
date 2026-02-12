
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Roles } from '../../../old-auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../old-auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../../../old-auth/guards/role-auth.guard';
import { Role } from '../../../modules/core/user/enums/role.enum';
import { EnvironmentsService } from './environments.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_SCHEMA } from '../../../utils/file-schema';
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface';

@ApiTags('Environments API')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/environments')
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.Owner, Role.Manager, Role.SuperAdmin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createEnvironmentDto: CreateEnvironmentDto,
    @Req() req: RequestWithMeta,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createEnvironmentDto.file = file;
    return this.environmentsService.create(
      createEnvironmentDto,
      req.org_id,
      req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.Owner, Role.Manager, Role.SuperAdmin)
  findAll() {
    return this.environmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.Owner, Role.Manager, Role.SuperAdmin)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.environmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.Owner, Role.Manager, Role.SuperAdmin)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
    @Req() req: RequestWithMeta,
  ) {
    const environment = await this.environmentsService.findOne(id);
    if (!environment) {
      throw new Error('Environment not found');
    }
    if (req.user.role !== Role.Admin && req.user.role !== Role.Owner && environment.user.id !== req.user.id) {
      throw new Error('You are not authorized to edit this environment');
    }
    return this.environmentsService.update(id, updateEnvironmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.Owner, Role.Manager, Role.SuperAdmin)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: RequestWithMeta) {
    const environment = await this.environmentsService.findOne(id);
    if (!environment) {
      return new Promise<void>((resolve) => resolve());
    }
    if (req.user.role !== Role.Admin && req.user.role !== Role.Owner && environment.user.id !== req.user.id) {
      throw new Error('You are not authorized to delete this environment');
    }
    return this.environmentsService.remove(id);
  }

  @Post(':id/file')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.Admin, Role.Owner, Role.Manager, Role.SuperAdmin)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithMeta,
  ) {
    const environment = await this.environmentsService.findOne(id);
    if (!environment) {
      throw new Error('Environment not found');
    }
    return this.environmentsService.uploadFile(id, req.org_id, file);
  }
}
