import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateGeneralFeedbackDto {
  @ApiProperty({
    type: 'string',
    description: 'General feedback message',
    example: '',
  })
  @IsOptional()
  @IsString()
  general_message: string

  @ApiProperty({
    type: 'number',
    description: 'rating',
    example: '',
  })
  @IsOptional()
  @IsNumber()
  rating: string

  @ApiProperty({
    type: 'string',
    description: 'User id',
    example: '',
  })
  @IsOptional()
  @IsString()
  userId: string

  @ApiProperty({
    type: 'string',
    description: 'Code text',
    example: '',
  })
  @IsOptional()
  @IsString()
  code: string

  @ApiProperty({
    type: 'string',
    description: 'username',
    example: '',
  })
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty({
    type: 'string',
    description: 'email',
    example: '',
  })
  @IsOptional()
  @IsString()
  email: string

  @ApiProperty({
    type: 'string',
    description: 'user role',
    example: '',
  })
  @IsOptional()
  @IsString()
  role: string

  @ApiProperty({
    type: 'string',
    description: 'Lesson name',
    example: 'JavaScript',
  })
  @IsOptional()
  @IsString()
  lessonName: string

  @ApiProperty({
    type: 'string',
    description: 'Slide URL',
    example:
      'http://localhost:8080/student/code-panel?courseId=c3bcc979-62f8-4af4-acca-692a789c19ee&unitId=3647411b-cdba-4cd1-bb43-0aa4af917de2&lessonId=e95619fe-ae34-40f5-9672-02b5866f68b9',
  })
  @IsOptional()
  @IsString()
  url: string
}
