import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'

import { RequestWithMeta } from '../../utils/interfaces/request-with-meta.interface'

@Injectable()
export class ManagerMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/require-await
  async use(
    request: RequestWithMeta,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    next()
  }
}
