import { Request } from 'express'

import type { User } from '../../modules/core/user/user.entity'

export interface RequestWithMeta extends Request {
  org_id: string
  org_slug: string
  org_name: string
  school_id: string
  referrer: string
  user: User & { studentID: string }
}
