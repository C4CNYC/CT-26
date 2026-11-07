/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common'
import { NextFunction, Response } from 'express'

import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

import dataSource from '../orm.datasource'

const TENANT_HEADER = 'x-tenant-id'
const SCHOOL_HEADER = 'x-school-id'

@Injectable()
export class OrgMiddleware implements NestMiddleware {
  async use(
    request: RequestWithMeta,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const header = request.headers[TENANT_HEADER] as string
    const school_id = request.headers[SCHOOL_HEADER] as string

    const organization_name = header?.toString().toLowerCase() || undefined
    if (!organization_name)
      throw new NotFoundException('provide organization slug')

    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }
    // Oldest first, so an organization created later with the same slug never answers for it
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const organization = (
      await dataSource.query(
        `SELECT * FROM organization 
         WHERE LOWER(slug) = LOWER($1) OR LOWER(domain) = LOWER($1)
         ORDER BY "createdAt" ASC
         LIMIT 1`,
        [organization_name],
      )
    )[0]

    if (!organization) {
      throw new NotFoundException(
        `Organization ${organization_name} doesn't exist`,
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    request.org_id = organization.id
    request.org_name = organization_name
    request.org_slug = organization.slug
    request.school_id = school_id
    let referrer = request.headers.referer || request.headers.referrer || ''
    if (Array.isArray(referrer)) {
      referrer = referrer[0]
    }
    /* Example referrer:
      - "https://example.com:8080/dashboard"
      - "https://app.codetribe.com/login"
      - "http://localhost:3000/"
    */
    let referrerDomainWithPort = ''
    if (referrer) {
      try {
      const url = new URL(referrer)
      referrerDomainWithPort = url.host // includes domain and port
      } catch {
      referrerDomainWithPort = ''
      }
    }
    let referrerExistsInDomain = false
    if (referrerDomainWithPort && organization.domain) {
      const referrerDomain = referrerDomainWithPort.split(':')[0]
      referrerExistsInDomain = organization.domain?.includes(`,${referrerDomain},`)
    }
    request.referrer = (referrerExistsInDomain && (referrerDomainWithPort)) ?
    referrerDomainWithPort :
      (organization.slug + '.codetribe.ai')
    next()
  }
}
