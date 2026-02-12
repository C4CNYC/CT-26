import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'
import { CustomHelpers, ErrorReport } from 'joi'

import {
  NoSubdirectoryAllowedError,
  parseUrl,
  WrongProtocolError,
} from './lib/parse-url'
import { Loglevel } from './loglevel.enum'
import { buildErrorMessage, parseOptionalNumber } from './utils'

export interface AppConfig {
  fallbackClientBaseUrl: string
  port: number
  loglevel: Loglevel
  showLogTimestamp: boolean
  persistInterval: number
  realtimeEnabled: boolean
}

function validateUrl(
  value: string,
  helpers: CustomHelpers,
): string | ErrorReport {
  try {
    return parseUrl(value).isPresent() ? value : helpers.error('string.uri')
  } catch (error) {
    if (error instanceof NoSubdirectoryAllowedError) {
      return helpers.error('url.noSubDirectoryAllowed')
    } else if (error instanceof WrongProtocolError) {
      return helpers.error('url.wrongProtocol')
    } else {
      throw error
    }
  }
}

const schema = Joi.object({
  fallbackClientBaseUrl: Joi.string()
    .custom(validateUrl)
    .default(Joi.ref('baseUrl'))
    .optional()
    .label('FALLBACK_CLIENT_BASE_URL'),
  port: Joi.number()
    .positive()
    .integer()
    .default(3000)
    .max(65535)
    .optional()
    .label('SERVER_PORT'),
  loglevel: Joi.string()
    .valid(...Object.values(Loglevel))
    .default(Loglevel.WARN)
    .optional()
    .label('LOGLEVEL'),
  showLogTimestamp: Joi.boolean()
    .default(true)
    .optional()
    .label('SHOW_LOG_TIMESTAMP'),
  persistInterval: Joi.number()
    .integer()
    .min(0)
    .default(10)
    .optional()
    .label('PERSIST_INTERVAL'),
  realtimeEnabled: Joi.boolean()
    .default(false)
    .optional()
    .label('REALTIME_ENABLED'),
}).messages({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'url.noSubDirectoryAllowed': '{{#label}} must not contain a subdirectory',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'url.wrongProtocol': '{{#label}} protocol must be HTTP or HTTPS',
})

export default registerAs('appConfig', () => {
  const appConfig = schema.validate(
    {
      fallbackClientBaseUrl: process.env.FALLBACK_CLIENT_BASE_URL,
      port: parseOptionalNumber(process.env.SERVER_PORT ?? process.env.PORT),
      loglevel: process.env.LOGLEVEL,
      showLogTimestamp: process.env.SHOW_LOG_TIMESTAMP,
      persistInterval: process.env.PERSIST_INTERVAL,
      realtimeEnabled: process.env.REALTIME_ENABLED,
    },
    {
      abortEarly: false,
      presence: 'required',
    },
  )
  if (appConfig.error) {
    const errorMessages = appConfig.error.details.map(
      (detail) => detail.message,
    )
    throw new Error(buildErrorMessage(errorMessages))
  }
  return appConfig.value as AppConfig
})
