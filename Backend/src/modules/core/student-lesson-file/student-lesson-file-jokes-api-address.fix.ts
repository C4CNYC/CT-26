import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { StudentLessonFile } from './student-lesson-file.entity'

const RETIRED_JOKE_API_URL_PATTERN =
  'https?://official-joke-api\\.appspot\\.com/jokes/random'
const QUOTED_JOKES_API_PATH_PATTERN =
  '"[[:space:]]*/api/jokes/random[[:space:]]*"'
const SPACED_JOKES_API_PATH_PATTERN =
  '"[[:space:]]+/api/jokes/random|/api/jokes/random[[:space:]]+"'

@Injectable()
export class StudentLessonFileJokesApiAddressFix
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(StudentLessonFileJokesApiAddressFix.name)

  constructor(
    @InjectRepository(StudentLessonFile)
    private readonly studentLessonFileRepository: Repository<StudentLessonFile>,
  ) {}

  onApplicationBootstrap(): void {
    void this.normalizeJokesApiAddress()
  }

  private async normalizeJokesApiAddress(): Promise<void> {
    try {
      const [, updated] = (await this.studentLessonFileRepository.query(
        `UPDATE "student-lesson-files" SET body = regexp_replace(regexp_replace(body, $1, '/api/jokes/random', 'g'), $2, '"/api/jokes/random"', 'g') WHERE body ~ $1 OR body ~ $3`,
        [
          RETIRED_JOKE_API_URL_PATTERN,
          QUOTED_JOKES_API_PATH_PATTERN,
          SPACED_JOKES_API_PATH_PATTERN,
        ],
      )) as [unknown[], number]
      this.logger.log(
        `Normalized the jokes API address in ${updated} student files`,
      )
    } catch (error) {
      this.logger.error(
        `Normalizing the jokes API address in student files failed: ${String(error)}`,
      )
    }
  }
}
