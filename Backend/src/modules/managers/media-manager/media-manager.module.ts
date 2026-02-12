import { Module } from '@nestjs/common'

import { MediaModule } from '../../core/media/media.module'
import { SchoolModule } from '../../core/school/school.module'
import { UserModule } from '../../core/user/user.module'
import { MediaManagerService } from './media-manager.service'

@Module({
  imports: [MediaModule, UserModule, SchoolModule],
  exports: [MediaManagerService],
  providers: [MediaManagerService],
})
export class MediaManagerModule {}
