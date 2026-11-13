import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { StudentLessonFile } from './student-lesson-file.entity'

const RETIRED_JOKE_API_URL_PATTERN =
  'https?://official-joke-api\\.appspot\\.com/jokes/random'
const OWN_JOKES_API_PATH = '/api/jokes/random'

@Injectable()
export class StudentLessonFileRetiredJokeApiUrlFix
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(
    StudentLessonFileRetiredJokeApiUrlFix.name,
  )

  constructor(
    @InjectRepository(StudentLessonFile)
    private readonly studentLessonFileRepository: Repository<StudentLessonFile>,
  ) {}

  onApplicationBootstrap(): void {
    void this.replaceRetiredJokeApiUrl()
  }

  private async replaceRetiredJokeApiUrl(): Promise<void> {
    try {
      const [, updated] = (await this.studentLessonFileRepository.query(
        `UPDATE "student-lesson-files" SET body = regexp_replace(body, $1, $2, 'g') WHERE body ~ $1`,
        [RETIRED_JOKE_API_URL_PATTERN, OWN_JOKES_API_PATH],
      )) as [unknown[], number]
      this.logger.log(
        `Replaced the retired joke API URL in ${updated} student files`,
      )
    } catch (error) {
      this.logger.error(
        `Replacing the retired joke API URL in student files failed: ${String(error)}`,
      )
    }
  }
}
