import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { UnsplashService } from './unsplash.service'

@ApiTags('Unsplash')
@Controller('unsplash')
export class UnsplashController {
  constructor(private readonly unsplashService: UnsplashService) {}

  @Get('image')
  async getImage(
    @Query('query') query: string = '',
    @Query('width') width: string = '300',
    @Query('height') height: string = '200',
    @Res() res: Response,
  ) {
    const w = parseInt(width, 10) || 300
    const h = parseInt(height, 10) || 200

    const buffer = await this.unsplashService.getImage(query, w, h)

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Content-Type', 'image/jpeg')
    res.end(buffer)
  }
}
