import { Role } from '@/modules/core/user/enums/role.enum';
import { Roles } from '@/old-auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Stats API (Manager)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) { }
  @Get('UserRegisteredStats')
  getUserRegisteredStats(@Query('nDays') nDays: number = 10): Promise<any> {
    return this.statsService.getUserRegisteredStats(nDays);
  }
  @Get('LessonCreatedStats')
  getLessonCreatedStats(@Query('nDays') nDays: number = 10) {
    return this.statsService.getLessonCreatedStats(nDays);
  }
  @Get('UserRegisteredStatsByOrg')
  getUserRegisteredStatsByOrg(@Query('nDays') nDays: number = 10) {
    return this.statsService.getUserRegisteredStatsByOrg(nDays);
  }
  @Get('CourseProgressStats')
  getCourseProgressStats(@Query('nDays') nDays: number = 10) {
    return this.statsService.getCourseProgressStats(nDays);
  }
  @Get('logActivityStats')
  logActivityStats(@Query('nDays') nDays: number = 10) {
    return this.statsService.logActivityStats(nDays);
  }
  @Get('logActivityLast')
  logActivityLast(@Query('nDays') nDays: number = 10) {
    return this.statsService.logActivityLast(nDays);
  }

}