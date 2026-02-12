import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JWT } from 'google-auth-library'

import { CreateGeneralFeedbackDto } from '@/api/feedback/dto/create-general-feedback.dto'
import { CreateSlideFeedbackDto } from '@/api/feedback/dto/create-slide-feedback.dto'
import { CreateTrainingFeedbackDto } from '@/api/feedback/dto/create-training-feedback.dto'
import { MessageDto } from '@/utils/dtos/message.dto'

const sheetTitles = {
  slides: 'slides',
  training: 'training',
  general: 'general',
}

@Injectable()
export class FeedbackService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  async createGeneralFeedback(
    dto: CreateGeneralFeedbackDto,
  ): Promise<MessageDto> {
    const { GoogleSpreadsheet } = await import('google-spreadsheet')
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

    const jwt = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    })
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_FEEDBACK_SPREADSHEET_ID as string,
      jwt,
    )
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle[sheetTitles.general]
    await sheet.loadHeaderRow()
    const date = new Date().toISOString()
    await sheet.addRow({
      code: dto.code,
      date: date,
      userId: dto.userId,
      rate: dto.rating,
      comment: dto.general_message,
      email: dto.email,
      userRole: dto.role,
      username: dto.username,
      lessonName: dto.lessonName,
      url: dto.url,
    })
    return new MessageDto('Feedback sent')
  }

  async createSlideFeedback(dto: CreateSlideFeedbackDto): Promise<MessageDto> {
    const { GoogleSpreadsheet } = await import('google-spreadsheet')
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

    const jwt = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    })
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_FEEDBACK_SPREADSHEET_ID as string,
      jwt,
    )
    await doc.loadInfo(true)
    const sheet = doc.sheetsByTitle[sheetTitles.slides]
    await sheet.loadHeaderRow()
    const date = new Date().toISOString()
    await sheet.addRow({
      code: dto.code,
      date: date,
      userId: dto.userId,
      rate: dto.rating,
      comment: dto.general_message,
      course: dto.courseId,
      training: dto.lessonId,
      lessonName: dto.lessonName,
      project: dto.unitId,
      slideNumber: dto.slideId,
      email: dto.email,
      userRole: dto.role,
      username: dto.username,
      url: dto.url,
    })

    return new MessageDto('Feedback sent')
  }

  async createTrainingFeedback(
    dto: CreateTrainingFeedbackDto,
  ): Promise<MessageDto> {
    const { GoogleSpreadsheet } = await import('google-spreadsheet')
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

    const jwt = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    })
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_FEEDBACK_SPREADSHEET_ID as string,
      jwt,
    )
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle[sheetTitles.training]
    await sheet.loadHeaderRow()
    const date = new Date().toISOString()
    await sheet.addRow({
      code: dto.code,
      date: date,
      userId: dto.userId,
      rate: dto.rating,
      comment: dto.general_message,
      course: dto.courseId,
      training: dto.lessonId,
      lessonName: dto.lessonName,
      project: dto.unitId,
      email: dto.email,
      userRole: dto.role,
      username: dto.username,
      url: dto.url,
    })

    return new MessageDto('Feedback sent')
  }
}
