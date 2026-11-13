import { Module } from '@nestjs/common'

import { JokesPublicApiController } from './jokes-public-api.controller'

@Module({
  controllers: [JokesPublicApiController],
})
export class JokesPublicApiModule {}
