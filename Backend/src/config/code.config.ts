import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

import {
  DefaultAccessLevel,
  getDefaultAccessLevelOrdinal,
} from './default-access-level.enum'
import { GuestAccess } from './guest_access.enum'
import { buildErrorMessage, parseOptionalNumber, toArrayConfig } from './utils'

export interface CodeConfig {
  forbiddenCodeIds: string[]
  maxDocumentLength: number
  guestAccess: GuestAccess
  permissions: {
    default: {
      everyone: DefaultAccessLevel
      loggedIn: DefaultAccessLevel
    }
  }
}

const schema = Joi.object<CodeConfig>({
  forbiddenCodeIds: Joi.array()
    .items(Joi.string())
    .optional()
    .default([])
    .label('FORBIDDEN_CODE_IDS'),
  maxDocumentLength: Joi.number()
    .default(100000)
    .positive()
    .integer()
    .optional()
    .label('MAX_DOCUMENT_LENGTH'),
  guestAccess: Joi.string()
    .valid(...Object.values(GuestAccess))
    .optional()
    .default(GuestAccess.CREATE)
    .label('GUEST_ACCESS'),
  permissions: {
    default: {
      everyone: Joi.string()
        .valid(...Object.values(DefaultAccessLevel))
        .optional()
        .default(DefaultAccessLevel.READ)
        .label('PERMISSION_DEFAULT_EVERYONE'),
      loggedIn: Joi.string()
        .valid(...Object.values(DefaultAccessLevel))
        .optional()
        .default(DefaultAccessLevel.WRITE)
        .label('PERMISSION_DEFAULT_LOGGED_IN'),
    },
  },
})

function checkEveryoneConfigIsConsistent(config: CodeConfig): void {
  const everyoneDefaultSet =
    process.env.PERMISSION_DEFAULT_EVERYONE !== undefined
  if (config.guestAccess === GuestAccess.DENY && everyoneDefaultSet) {
    throw new Error(
      `'GUEST_ACCESS' is set to '${config.guestAccess}', but 'PERMISSION_DEFAULT_EVERYONE' is also configured. Please remove 'PERMISSION_DEFAULT_EVERYONE'.`,
    )
  }
}

function checkLoggedInUsersHaveHigherDefaultPermissionsThanGuests(
  config: CodeConfig,
): void {
  const everyone = config.permissions.default.everyone
  const loggedIn = config.permissions.default.loggedIn
  if (
    getDefaultAccessLevelOrdinal(everyone) >
    getDefaultAccessLevelOrdinal(loggedIn)
  ) {
    throw new Error(
      `'PERMISSION_DEFAULT_EVERYONE' is set to '${everyone}', but 'PERMISSION_DEFAULT_LOGGED_IN' is set to '${loggedIn}'. This gives everyone greater permissions than logged-in users which is not allowed.`,
    )
  }
}

export default registerAs('codeConfig', () => {
  const codeConfig = schema.validate(
    {
      forbiddenCodeIds: toArrayConfig(process.env.FORBIDDEN_CODE_IDS, ','),
      maxDocumentLength: parseOptionalNumber(process.env.MAX_DOCUMENT_LENGTH),
      guestAccess: process.env.GUEST_ACCESS,
      permissions: {
        default: {
          everyone: process.env.PERMISSION_DEFAULT_EVERYONE,
          loggedIn: process.env.PERMISSION_DEFAULT_LOGGED_IN,
        },
      },
    } as CodeConfig,
    {
      abortEarly: false,
      presence: 'required',
    },
  )
  if (codeConfig.error) {
    const errorMessages = codeConfig.error.details.map(
      (detail) => detail.message,
    )
    throw new Error(buildErrorMessage(errorMessages))
  }
  const config = codeConfig.value
  checkEveryoneConfigIsConsistent(config)
  checkLoggedInUsersHaveHigherDefaultPermissionsThanGuests(config)
  return config
})
