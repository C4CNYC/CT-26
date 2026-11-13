import { Controller, Get, Header } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import officialJokeApiJokes from './official-joke-api-jokes.json'

@ApiTags('Jokes API (PUBLIC)')
@Controller('jokes')
export class JokesPublicApiController {
  @Get('random')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  getRandomJoke() {
    const index = Math.floor(Math.random() * officialJokeApiJokes.length)
    return { ...officialJokeApiJokes[index], id: index + 1 }
  }
}
