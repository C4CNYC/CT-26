import { Module } from '@nestjs/common'

import { MediaManagerModule } from '../../../modules/managers/media-manager/media-manager.module'
import { S3Module } from '../../../providers/s3/s3.module'
import { MediaManagerApiController } from './media-manager-api.controller'
import { MediaManagerApiService } from './media-manager-api.service'

@Module({
  imports: [MediaManagerModule, S3Module],
  providers: [MediaManagerApiService],
  controllers: [MediaManagerApiController],
})
export class MediaManagerApiModule {}
