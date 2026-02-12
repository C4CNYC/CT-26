import * as Swagger from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class SendMailDto {
  @Swagger.ApiProperty({
    example: 'user@email.com',
    name: 'email',
  })
  @IsEmail()
  @Expose({ name: 'email', toClassOnly: true })
  to: string

  @Swagger.ApiProperty({
    example: 'test qr.api',
  })
  @IsString()
  subject: string

  @Swagger.ApiProperty({
    description: 'Fill it with your validated email on SendGrid account',
    example: 'no-reply@qr.com',
  })
  @IsEmail()
  from: string

  @Swagger.ApiProperty({
    example: 'Hello, world!',
  })
  @IsOptional()
  @IsString()
  text: string

  @Swagger.ApiProperty({
    example: '<h1>Hello, World</h1>',
  })
  @IsOptional()
  @IsString()
  html?: string
}
