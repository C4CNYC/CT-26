import { Controller, Get, Logger, Param, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { UnsplashService } from './unsplash.service'

@ApiTags('Unsplash')
@Controller('unsplash')
export class UnsplashController {
  private readonly logger = new Logger(UnsplashController.name)

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
    await this.render(query, w, h, res)
  }

  @Get(':dims([0-9]+x[0-9]+)/:query')
  async getImageByPath(
    @Param('dims') dims: string,
    @Param('query') query: string,
    @Res() res: Response,
  ) {
    const [w, h] = this.parseDims(dims)
    await this.render(query, w, h, res)
  }

  @Get(':dims([0-9]+x[0-9]+)')
  async getImageByDims(@Param('dims') dims: string, @Res() res: Response) {
    const [w, h] = this.parseDims(dims)
    await this.render('', w, h, res)
  }

  private parseDims(dims: string): [number, number] {
    const [wStr, hStr] = dims.split('x')
    return [parseInt(wStr, 10) || 300, parseInt(hStr, 10) || 200]
  }

  private async render(query: string, width: number, height: number, res: Response) {
    try {
      const buffer = await this.unsplashService.getImage(query, width, height)
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
      res.setHeader('Content-Type', 'image/jpeg')
      res.end(buffer)
    } catch (err) {
      this.logger.error('Unsplash proxy failed', err instanceof Error ? err.message : err)
      res.status(502).json({ error: 'Failed to fetch image', details: err instanceof Error ? err.message : 'Unknown error' })
    }
  }
}
