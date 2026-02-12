import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { classroom_v1, google } from 'googleapis'

import googleAuthConfig from '@/config/google-auth.config'

@Injectable()
export class GoogleClassesService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private oauth2Client: any //OAuth2Client
  private readonly logger = new Logger(GoogleClassesService.name)

  constructor(
    @Inject(googleAuthConfig.KEY)
    {
      clientId,
      clientSecret,
      callbackUrl,
    }: ConfigType<typeof googleAuthConfig>,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      callbackUrl,
    )
  }

  async listCourses(
    access_token: string,
  ): Promise<classroom_v1.Schema$Course[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.oauth2Client.setCredentials({ access_token })

      const classroom = google.classroom({
        version: 'v1',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        auth: this.oauth2Client,
      })

      const { data } = await classroom.courses.list()

      return data.courses || []
    } catch (error) {
      this.logger.error(
        'Failed to fetch Google Classroom courses',
        'listCourses',
      )

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error?.code === 401 || error?.code === 403) {
          throw new UnauthorizedException(
            'Invalid or expired Google access token. Please login again.',
          )
        }
      }

      throw new InternalServerErrorException(
        'Unexpected error occurred while fetching Google Classroom courses',
      )
    }

    return []
  }

  async listStudents(
    access_token: string,
    course_id: string,
  ): Promise<classroom_v1.Schema$Student[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.oauth2Client.setCredentials({ access_token })

      const classroom = google.classroom({
        version: 'v1',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        auth: this.oauth2Client,
      })

      const { data } = await classroom.courses.students.list({
        courseId: course_id,
      })

      return data.students || []
    } catch (error) {
      this.logger.error(
        `Failed to fetch students from Google Classroom. CourseId=${course_id}`,
        'listStudents',
      )

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if ((error as { code: number }).code === 403) {
          throw new UnauthorizedException(
            'Insufficient permissions to fetch students from Google Classroom. Please re-authenticate with the correct scopes.',
          )
        }

        if ((error as { code: number }).code === 404) {
          throw new NotFoundException(
            `Google Classroom course not found: ${course_id}`,
          )
        }
      }

      throw new InternalServerErrorException(
        'Unexpected error occurred while fetching students from Google Classroom',
      )
    }
  }
}
