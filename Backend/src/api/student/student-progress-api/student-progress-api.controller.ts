import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { ContinueLessonRaw } from '@/modules/core/student-lesson-progress/student-lesson-progress.service'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'

import { Role } from '../../../modules/core/user/enums/role.enum'
import { StudentProgressManagerService } from '../../../modules/managers/student-progress-manager/student-progress-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { RequestWithMeta } from '../../../utils/interfaces/request-with-meta.interface'
import { ChompleteChalangeDTO } from './dtos/complete-chalange.dto'
import { VisitLessonDto } from './dtos/visit-lesson.dto'

@ApiTags('Project API (STUDENT)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager, Role.Student)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('student/progress')
export class StudentProgressApiController {
  constructor(
    private studentProgressManagerService: StudentProgressManagerService,
  ) {}

  @Post('complete-chalange')
  async completeChalange(
    @Req() request: RequestWithMeta,
    @Body() dto: ChompleteChalangeDTO,
  ): Promise<MessageDto> {
    if (!request.user) {
      return new MessageDto('Login to save your progress')
    }
    await this.studentProgressManagerService.completeChalange(
      request.user?.studentID,
      dto,
    )
    return new MessageDto('lesson completed successfully')
  }
  @Get('lessons')
  async getLessonProgressByStudent(
    @Req() request: RequestWithMeta,
  ): Promise<object> {
    if (!request.user) {
      return new MessageDto('Log in to see your progress')
    }
    return await this.studentProgressManagerService.getLessonProgressByStudent(
      request.user?.studentID,
    )
  }

  @Get('get-complete-chalange')
  async getCompleteChalanges(@Req() request: RequestWithMeta): Promise<object> {
    if (!request.user) {
      return new MessageDto('Log in to see completed challenges')
    }
    const challenges =
      await this.studentProgressManagerService.getCompletedChallenged(
        request.user?.studentID,
      )
    return challenges
  }

  @Get('course/:courseId/:studentId')
  async getLastLessonByCourse(
    @Req() request: RequestWithMeta,
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ): Promise<MessageDto | ContinueLessonRaw | undefined> {
    if (!request.user) {
      return new MessageDto('Login to see your progress')
    }

    return await this.studentProgressManagerService.getLastLessonByCourse(
      studentId,
      courseId,
    )
  }

  @Get('module/:moduleId/:studentId')
  async getLastLessonByModule(
    @Req() request: RequestWithMeta,
    @Param('moduleId') moduleId: string,
    @Param('studentId') studentId: string,
  ): Promise<MessageDto | ContinueLessonRaw | undefined> {
    if (!request.user) {
      return new MessageDto('Login to see your progress')
    }

    return await this.studentProgressManagerService.getLastLessonByModule(
      studentId,
      moduleId,
    )
  }

  @Post('complete-lesson')
  async completeLesson(
    @Req() request: RequestWithMeta,
    @Body()
    body: {
      studentId: string
      lessonId: string
    },
  ) {
    if (!request.user) return new MessageDto('Login to save progress')

    await this.studentProgressManagerService.completeLesson(body)

    return new MessageDto('Lesson completed successfully')
  }

  @Post('visit-lesson')
  async visitLesson(
    @Req() request: RequestWithMeta,
    @Body() dto: VisitLessonDto,
  ) {
    await this.studentProgressManagerService.visitLesson(dto)
    return new MessageDto('lesson visited')
  }
}
