import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'

import { CreateGeneralFeedbackDto } from '@/api/feedback/dto/create-general-feedback.dto'
import { CreateSlideFeedbackDto } from '@/api/feedback/dto/create-slide-feedback.dto'
import { CreateTrainingFeedbackDto } from '@/api/feedback/dto/create-training-feedback.dto'
import { MessageDto } from '@/utils/dtos/message.dto'

import { FeedbackService } from './feedback.service'

@ApiTags('Task API (Manager)')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackManagerApiService: FeedbackService) {}

  @Post('/general')
  async createGeneralFeedback(
    @Body() dto: CreateGeneralFeedbackDto,
  ): Promise<MessageDto> {
    return await this.feedbackManagerApiService.createGeneralFeedback(dto)
  }

  @Post('/slide')
  async createSlideFeedback(
    @Body() dto: CreateSlideFeedbackDto,
  ): Promise<MessageDto> {
    return await this.feedbackManagerApiService.createSlideFeedback(dto)
  }

  @Post('/training')
  async createTrainingFeedback(
    @Body() dto: CreateTrainingFeedbackDto,
  ): Promise<MessageDto> {
    return await this.feedbackManagerApiService.createTrainingFeedback(dto)
  }
}
