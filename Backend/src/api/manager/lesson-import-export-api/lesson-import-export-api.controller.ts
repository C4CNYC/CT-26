
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Role } from '../../../modules/core/user/enums/role.enum'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard' 

import { ExportLessonDto } from './export-lesson.dto'
import { LessonImportExportApiService } from './lesson-import-export-api.service'
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor'
import { AuthUser } from '@/old-auth/decorators/user.decorator'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

@ApiTags('School API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@Controller('manager/lesson-import-export')
export class LessonImportExportApiController {
  constructor(
    private lessonImportExportApiService: LessonImportExportApiService,
  ) {}

  @Get('export/:lessonId')
  async exportLesson(@Param() exportLessonDto: ExportLessonDto) {
    return await this.lessonImportExportApiService.exportLesson(exportLessonDto)
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importLesson(
    
    @Request() request: RequestWithMeta, 
    @UploadedFile() file: Express.Multer.File,) {
    return await this.lessonImportExportApiService.importLesson(request.user.id, request.school_id,  file)
  }

  @Post('validate')
  async validateImportData(@Body() data: any) {
    return await this.lessonImportExportApiService.validateImportData(data)
  }
}