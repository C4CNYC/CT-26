import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function setupApiDocs(app: INestApplication): void {
  const api_options = new DocumentBuilder()
    .setTitle('CodeTribe API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()
  const api_doc = SwaggerModule.createDocument(app, api_options)

  SwaggerModule.setup('/apidoc', app, api_doc)
}
