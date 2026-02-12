
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogActivity } from './log-activity.entity';
import { LogActivityService } from './log-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogActivity])],
  providers: [LogActivityService],
  exports: [LogActivityService],
})
export class ActivityLogModule {}