import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'

import { Role } from '../../../modules/core/user/enums/role.enum'
import { User } from '../../../modules/core/user/user.entity'
import { StudentTeachersApiService } from './student-teachers-api.services'

@ApiTags('Classmate API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/classmates')
export class StudentTeachersApiController {
  constructor(private studentTeachersApiService: StudentTeachersApiService) {}

  @Get()
  async getClassmates(): Promise<User[]> {
    return await this.studentTeachersApiService.getMyTeachers()
  }
}
