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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'

import { LessonContentValidator } from '../../../modules/core/lesson-content-validator/lesson-content-validator.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { CreateLessonContentValidationDto } from './dtos/create-content-lesson-validation.dto'
import { UpdateLessonContenValidationtDto } from './dtos/update-content-lesson-validation.dto'
import { LessonContentValidationManagerApiService } from './lesson-content-validation-manager-api.service'

@ApiTags('Lesson Content Validation API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Editor)
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('manager/content/:id/validation')
export class LessonContentManagerApiController {
  constructor(
    private lessonContentValidationManagerApiService: LessonContentValidationManagerApiService,
  ) {}

  @Post()
  async createLessonContent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateLessonContentValidationDto,
  ): Promise<LessonContentValidator> {
    return await this.lessonContentValidationManagerApiService.createLessonContentValidation(
      id,
      dto,
    )
  }

  @Get()
  async getLessonContent(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<LessonContentValidator[]> {
    return await this.lessonContentValidationManagerApiService.getLessonContentValidations(
      id,
    )
  }

  @Patch('/:validation_id')
  async updateLessonContent(
    @Param('validation_id', new ParseUUIDPipe()) validation_id: string,
    @Body() dto: UpdateLessonContenValidationtDto,
  ): Promise<MessageDto> {
    return await this.lessonContentValidationManagerApiService.updateLessonContentValidation(
      validation_id,
      dto,
    )
  }

  @Delete('/:validation_id')
  async removeLessonContent(
    @Param('validation_id', new ParseUUIDPipe()) id: string,
  ): Promise<MessageDto> {
    return await this.lessonContentValidationManagerApiService.removeLessonContentValidation(
      id,
    )
  }
}
