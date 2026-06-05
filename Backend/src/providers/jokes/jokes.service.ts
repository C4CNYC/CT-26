import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class JokesService {
  private readonly logger = new Logger(JokesService.name)

  async getRandomJoke(): Promise<string> {
    const endpoint = 'https://official-joke-api.appspot.com/jokes/random'
    const response = await fetch(endpoint)

    if (!response.ok) {
      this.logger.error(`Joke API error: ${response.status}`)
      throw new Error(`Joke API error: ${response.status}`)
    }

    return response.text()
  }
}
