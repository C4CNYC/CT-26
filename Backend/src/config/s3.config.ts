import { registerAs } from '@nestjs/config'

export interface S3Config {
  awsAccessKeyId: string
  awsSecretAccessKey: string
  bucketName: string
}

export default registerAs('s3Config', () => {
  return {
    awsAccessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
  } as S3Config
})
