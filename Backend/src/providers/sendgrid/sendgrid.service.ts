import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import sgMail from '@sendgrid/mail'

import sendgridConfig from '@/config/sendgrid.config'

@Injectable()
export class SendgridService {
  constructor(
    @Inject(sendgridConfig.KEY)
    { apiKey }: ConfigType<typeof sendgridConfig>,
  ) {
    sgMail.setApiKey(apiKey)
  }

  async send(mail: sgMail.MailDataRequired): Promise<unknown> {
    console.log(`Mail will be sent ${mail.from} ${mail.to} ${mail.subject} `)
    return sgMail.send(mail)
  }
}
