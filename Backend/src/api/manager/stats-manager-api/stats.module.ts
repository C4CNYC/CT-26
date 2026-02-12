import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { StatsManagerModule } from '@/modules/managers/stats-manager/stats.module';

@Module({
  imports: [StatsManagerModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}