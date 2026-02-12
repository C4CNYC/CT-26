import { StatsManagerService } from '@/modules/managers/stats-manager/stats.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService { 
  constructor(
    private readonly statsManagerService: StatsManagerService,
  ) {}
  getUserRegisteredStats(nDays: number) {
    return this.statsManagerService.getUserRegisteredStats(nDays);
  }
  getLessonCreatedStats(nDays: number) {
    return this.statsManagerService.getLessonCreatedStats(nDays);
  }
  getUserRegisteredStatsByOrg(nDays: number) {
    return this.statsManagerService.getUserRegisteredStatsByOrg(nDays);
  }
  getCourseProgressStats(nDays: number) {
    return this.statsManagerService.getCourseProgressStats(nDays);
  }
  logActivityStats(nDays: number) {
    return this.statsManagerService.logActivityStats(nDays);
  }
  logActivityLast(nDays: number) {
    return this.statsManagerService.logActivityLast(nDays);
  }
}