import { LogActivity } from '@/modules/core/log-activity/log-activity.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { LogActivityManagerService } from './logactivity.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogActivity])],
  providers: [ LogActivityManagerService],
  exports: [LogActivityManagerService],
})
export class LogActivityManagerModule {}