import { Controller, Get, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { JokesService } from './jokes.service'

@ApiTags('Jokes')
@Controller('jokes')
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  @Get('random')
  async getRandomJoke(@Res() res: Response) {
    const jokeJson = await this.jokesService.getRandomJoke()
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    res.end(jokeJson)
  }
}
