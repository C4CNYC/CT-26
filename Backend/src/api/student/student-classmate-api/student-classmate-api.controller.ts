import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { Roles } from '@/old-auth/decorators/roles.decorator'
import { AuthUser } from '@/old-auth/decorators/user.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'

import { Student } from '../../../modules/core/student/student.entity'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { PageDto } from '../../../utils/dtos/page.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { MyClassmateSearchOptions } from './dtos/my-courses-search-options.dto'
import { StudentClassmateApiService } from './student-classmate-api.services'

@ApiTags('Classmate API (STUDENT)')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/classmates')
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
export class StudentClassmateApiController {
  constructor(private studentClassmateApiService: StudentClassmateApiService) {}

  @Get()
  async getClassmates(
    @Request() request: RequestWithMeta,
    @Query() page_options_dto: MyClassmateSearchOptions,
    @AuthUser() userId: string,
  ): Promise<PageDto<Student>> {
    return await this.studentClassmateApiService.getClassmates(
      userId,
      page_options_dto,
    )
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getClassmate(
    @Request() request: RequestWithMeta,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Student> {
    return await this.studentClassmateApiService.getClassmate(id)
  }
}
