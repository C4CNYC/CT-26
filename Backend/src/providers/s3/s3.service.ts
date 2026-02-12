import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'

import s3Config from '@/config/s3.config'

import { ApplicationEventEnum } from '../../modules/managers/users-manager/enums/application-event'

import S3 = require('aws-sdk/clients/s3')

@Injectable()
export class S3Service {
  private readonly s3: S3
  private readonly config: ConfigType<typeof s3Config>

  constructor(
    @Inject(s3Config.KEY)
    config: ConfigType<typeof s3Config>,
  ) {
    this.config = config
    this.s3 = new S3({
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    })
  }

  @OnEvent(ApplicationEventEnum.REMOVE_FILE)
  async removeFile(filePath: string): Promise<void> {
    if (!filePath) return
    await this.s3
      .deleteObject({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Bucket: this.config.bucketName,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Key: filePath,
      })
      .promise()
  }

  async uploadFile(filePath: string, dataRaw: Buffer): Promise<string> {
    const data = await this.s3
      .upload({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Bucket: this.config.bucketName,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ACL: 'public-read',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Key: filePath,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Body: dataRaw,
      })
      .promise()

    return data.Location
  }

  async readTranslationFile(fileName: string): Promise<string> {
    const parameters = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Bucket: this.config.bucketName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Key: fileName,
    }
    const response = await this.s3.getObject(parameters).promise()
    return response.Body?.toString('utf-8') ?? ''
  }
}
