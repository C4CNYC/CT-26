
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './entities/environment.entity';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsController } from './environments.controller';
import { AuthModule } from '../../../old-auth/auth.module';

import { S3Module } from '../../../providers/s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Environment]), AuthModule, S3Module],
  controllers: [EnvironmentsController],
  providers: [EnvironmentsService],
  exports: [EnvironmentsService],
})
export class EnvironmentsModule {}
