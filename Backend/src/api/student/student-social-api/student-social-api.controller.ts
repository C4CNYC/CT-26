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

import { StudentSocial } from '../../../modules/core/student-social/student-social.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { CreateStudentSocialDto } from './dtos/create-student-social.dto'
import { UpdateStudentSocialDto } from './dtos/update-student-social.dto'
import { StudentSocialApiService } from './student-social-api.service'

@ApiTags('Student Socials API (Student)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/:student_id')
export class StudentSocialApiController {
  constructor(private studentSocialApiService: StudentSocialApiService) {}

  @Get('/social')
  async getStudentSocials(
    @Param('student_id', new ParseUUIDPipe()) student_id: string,
  ): Promise<StudentSocial[]> {
    return await this.studentSocialApiService.getStudentSocials(student_id)
  }

  @Post('/social')
  async createSocialLink(
    @Param('student_id', new ParseUUIDPipe()) student_id: string,
    @Body() dto: CreateStudentSocialDto,
  ): Promise<StudentSocial> {
    return await this.studentSocialApiService.createSocialLink(student_id, dto)
  }

  @Delete('/social/:social_id')
  async deleteSocialLink(
    @Param('student_id', new ParseUUIDPipe()) student_id: string,
    @Param('social_id', new ParseUUIDPipe()) social_id: string,
  ): Promise<MessageDto> {
    return await this.studentSocialApiService.deleteSocialLink(
      student_id,
      social_id,
    )
  }

  @Patch('/social/:social_id')
  async updateSocialLink(
    @Param('student_id', new ParseUUIDPipe()) student_id: string,
    @Param('social_id', new ParseUUIDPipe()) social_id: string,
    @Body() dto: UpdateStudentSocialDto,
  ): Promise<MessageDto> {
    return await this.studentSocialApiService.updateSocialLink(
      student_id,
      social_id,
      dto,
    )
  }
}
