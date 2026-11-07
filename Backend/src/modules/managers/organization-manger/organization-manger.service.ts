import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Like, Raw } from 'typeorm'

import { UpdateOrganizationByOwnerDto } from '@/api/admin/organization-api/dtos/update-organization.dto'
import { CreateOrganizationDto } from '@/api/super-admin/organization-api/dtos/create-organization.dto'
import { OrganizationSearchOptions } from '@/api/super-admin/organization-api/dtos/organization-search-options.dto'
import { UpdateOrganizationDto } from '@/api/super-admin/organization-api/dtos/update-organization.dto'
import { Organization } from '@/modules/core/organization/organization.entity'
import { OrganizationService } from '@/modules/core/organization/organization.service'
import { Role } from '@/modules/core/user/enums/role.enum'
import { UserService } from '@/modules/core/user/user.service'
import { S3Service } from '@/providers/s3/s3.service'
import { InMemoryCacheService } from '@/utils/cache/in-memory-cache.service'
import { MessageDto } from '@/utils/dtos/message.dto'
import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder'

import { PageDto } from '../../../utils/dtos/page.dto'
import { ApplicationEventEnum as Event } from '../users-manager/enums/application-event'

import path = require('path')

// A slug becomes the hostname <slug>.codetribe.ai, so it must be a single DNS label
const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

// Hostnames we use or plan to use on codetribe.ai and codetribe.com
const RESERVED_ORGANIZATION_SLUGS = [
  'admin',
  'api',
  'api-v1',
  'app',
  'ct26',
  'ct26be',
  'ct26fe',
  'ct26n8n',
  'docs',
  'kedi',
  'mail',
  'me',
  'stage',
  'stage1',
  'staging',
  'www',
]

@Injectable()
export class OrganizationManagerService {
  constructor(
    private s3Service: S3Service,
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    private organizationService: OrganizationService,
    private cacheService: InMemoryCacheService,
  ) {}

  async checkUserPermission(id: string, user_id: string): Promise<boolean> {
    const user = await this.userService.findOne({
      where: { id: user_id },
      select: ['role'],
    })

    if (user.role === Role.SuperAdmin) return true

    const organization = await this.organizationService.findOne({
      where: { id, owner: { id: user_id } },
    })

    if (!organization) {
      throw new NotFoundException('Organization not found')
    }

    return true
  }

  async getBySlug(domain: string): Promise<Organization> {
    const firstPart = domain.split('.')[0]
    const organizations = await this.organizationService.find([
      { domain: Like(`%,${domain},%`) },
      { slug: firstPart },
    ])

    const sortedOrganizations = organizations.sort((a, b) => {
      const aPriority = a.domain.includes(`,${domain},`) ? 1 : 0
      const bPriority = b.domain.includes(`,${domain},`) ? 1 : 0
      return bPriority - aPriority // Higher priority first
    })

    const organization = sortedOrganizations[0] || null
    if (!organization) {
      throw new NotFoundException('Organization not found')
    }

    return organization
  }

  async checkOrganizationSlugAvailability(
    subdomain: string,
  ): Promise<{ slug: string; isAvailable: boolean; message: string }> {
    const slug = (subdomain ?? '').trim().toLowerCase()

    if (!ORGANIZATION_SLUG_PATTERN.test(slug)) {
      return {
        slug,
        isAvailable: false,
        message: 'Use only letters, numbers and hyphens',
      }
    }

    const isTaken =
      RESERVED_ORGANIZATION_SLUGS.includes(slug) ||
      Boolean(
        await this.organizationService.findOne({
          where: [
            { slug: Raw((column) => `LOWER(${column}) = :slug`, { slug }) },
            { domain: Like(`%,${slug}.codetribe.ai,%`) },
          ],
          select: ['id'],
        }),
      )

    return isTaken
      ? { slug, isAvailable: false, message: 'Subdomain is already taken' }
      : { slug, isAvailable: true, message: 'Subdomain is available' }
  }

  async getHomePage(tenantName: string): Promise<Organization> {
    if (!tenantName) throw new Error('tenantName is empty')

    const organization = await this.organizationService.findOne({
      where: { name: Like(`%${tenantName}%`) },
      select: ['home_page_body', 'home_page_type'],
    })

    if (organization) return organization

    return await this.organizationService.findOne({
      where: { slug: Like('codetribe') },
      select: ['home_page_body', 'home_page_type'],
    })
  }

  async getList(
    pageOptionsDto: OrganizationSearchOptions,
    org_id?: string,
  ): Promise<PageDto<Organization>> {
    return await this.organizationService.getList(pageOptionsDto, org_id)
  }

  async getOne(id: string): Promise<Organization> {
    return await this.organizationService.findOne({
      where: { id },
    })
  }

  async getOrganizationByOwner(user_id: string): Promise<Organization> {
    const organization = await this.organizationService.findOne({
      where: { owner: { id: user_id } },
    })

    if (!organization) {
      throw new NotFoundException('Organization not found')
    }

    return organization
  }

  async createOrganization(
    data: CreateOrganizationDto,
    ownerId?: string,
  ): Promise<Organization> {
    return await this.organizationService.createOrganizationWithCatalog(
      data,
      ownerId,
    )
  }

  async updateOrganization(
    id: string,
    data: UpdateOrganizationDto,
  ): Promise<MessageDto> {
    await this.organizationService.update(id, data)

    // Invalidate cache for this organization
    await this.invalidateOrganizationCache(id)

    return new MessageDto('Organization updated successfully')
  }

  async updateOrganizationByOwner(
    id: string,
    user_id: string,
    data: UpdateOrganizationByOwnerDto,
  ): Promise<MessageDto> {
    await this.checkUserPermission(id, user_id)

    await this.organizationService.update(id, data)

    // Invalidate cache for this organization
    await this.invalidateOrganizationCache(id)

    return new MessageDto('Organization updated successfully')
  }

  async updateOrganizationOwner(
    id: string,
    user_id: string,
  ): Promise<MessageDto> {
    const user = await this.userService.findOne({ where: { id: user_id } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const assignedOrganization = await this.organizationService.findOne({
      where: { owner: { id: user_id } },
    })

    if (assignedOrganization) {
      throw new ConflictException(
        `User already assigned to an organization ${assignedOrganization.name}`,
      )
    }

    await this.organizationService.update(id, { owner: user })

    return new MessageDto('Organization owner updated successfully')
  }

  async uploadLogo(
    id: string,
    user_id: string,
    { originalname, buffer }: Express.Multer.File,
  ): Promise<MessageDto> {
    await this.checkUserPermission(id, user_id)

    const organization = await this.organizationService.findOne({
      where: { id },
    })
    const old_file_path = `${TENANT_PATH_BUILDER.root(id)}/logo_${path.basename(organization.logo || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.root(id)}/logo_${id}${path.extname(originalname)}`
    const logo = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.organizationService.update(id, { logo })
    if (organization.logo)
      this.eventEmitter.emit(Event.REMOVE_FILE, old_file_path)
    return new MessageDto('logo updated')
  }

  async deleteLogo(id: string, user_id: string): Promise<MessageDto> {
    await this.checkUserPermission(id, user_id)

    const organization = await this.organizationService.findOne({
      where: { id },
    })

    if (!organization?.logo) {
      throw new NotFoundException('Logo not found')
    }

    const filePath = `${TENANT_PATH_BUILDER.root(id)}/logo_${path.basename(organization.logo)}`

    this.eventEmitter.emit(Event.REMOVE_FILE, filePath)

    await this.organizationService.update(id, { logo: null })

    await this.invalidateOrganizationCache(id)

    return new MessageDto('logo deleted')
  }

  async uploadMiniLogo(
    id: string,
    user_id: string,
    { originalname, buffer }: Express.Multer.File,
  ): Promise<MessageDto> {
    await this.checkUserPermission(id, user_id)

    const organization = await this.organizationService.findOne({
      where: { id },
    })
    const old_file_path = `${TENANT_PATH_BUILDER.root(id)}/min_logo_${path.basename(organization.min_logo || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.root(id)}/min_logo_${id}${path.extname(originalname)}`
    const miniLogo = await this.s3Service.uploadFile(new_file_path, buffer)

    await this.organizationService.update(id, { min_logo: miniLogo })
    if (organization.min_logo)
      this.eventEmitter.emit(Event.REMOVE_FILE, old_file_path)
    return new MessageDto('mini logo updated')
  }

  async deleteMiniLogo(id: string, user_id: string): Promise<MessageDto> {
    await this.checkUserPermission(id, user_id)

    const organization = await this.organizationService.findOne({
      where: { id },
    })

    if (!organization?.min_logo) {
      throw new NotFoundException('Mini logo not found')
    }

    const filePath = `${TENANT_PATH_BUILDER.root(id)}/min_logo_${path.basename(organization.min_logo)}`

    this.eventEmitter.emit(Event.REMOVE_FILE, filePath)

    await this.organizationService.update(id, { min_logo: null })

    await this.invalidateOrganizationCache(id)

    return new MessageDto('mini logo deleted')
  }

  async uploadFavicon(
    id: string,
    user_id: string,
    file: Express.Multer.File,
  ): Promise<MessageDto> {
    await this.checkUserPermission(id, user_id)

    const organization = await this.organizationService.findOne({
      where: { id },
    })
    const old_file_path = `${TENANT_PATH_BUILDER.root(id)}/favicon_${path.basename(organization.favicon || '')}`
    const new_file_path = `${TENANT_PATH_BUILDER.root(id)}/favicon_${id}${path.extname(file.originalname)}`
    const favicon = await this.s3Service.uploadFile(new_file_path, file.buffer)

    await this.organizationService.update(id, { favicon })
    if (organization.favicon)
      this.eventEmitter.emit(Event.REMOVE_FILE, old_file_path)
    return new MessageDto('favicon updated')
  }

  async deleteFavicon(id: string, user_id: string): Promise<MessageDto> {
    await this.checkUserPermission(id, user_id)

    const organization = await this.organizationService.findOne({
      where: { id },
    })

    if (!organization?.favicon) {
      throw new NotFoundException('Favicon not found')
    }

    const filePath = `${TENANT_PATH_BUILDER.root(id)}/favicon_${path.basename(organization.favicon)}`

    this.eventEmitter.emit(Event.REMOVE_FILE, filePath)

    await this.organizationService.update(id, { favicon: null })

    await this.invalidateOrganizationCache(id)

    return new MessageDto('favicon deleted')
  }

  async removeOrganizationOwner(id: string): Promise<MessageDto> {
    await this.organizationService.update(id, { owner: null })

    return new MessageDto('Organization owner removed successfully')
  }

  async deleteOrganization(id: string): Promise<MessageDto> {
    await this.organizationService.remove(id)

    // Invalidate cache for this organization
    await this.invalidateOrganizationCache(id)

    return new MessageDto('Organization deleted successfully')
  }
  /**
   * Invalidate cache entries for an organization
   * This clears cache for all domains associated with the organization
   */
  private async invalidateOrganizationCache(
    organizationId: string,
  ): Promise<void> {
    try {
      // Get the organization to find its domains
      const organization = await this.organizationService.findOne({
        where: { id: organizationId },
        select: ['slug', 'domain'],
      })

      if (organization) {
        // Invalidate by slug
        const slugKey = this.cacheService.generateTenantKey(organization.slug)
        this.cacheService.delete(slugKey)

        // Invalidate by domain parts
        if (organization.domain) {
          const domains = organization.domain
            .split(',')
            .filter((d) => d && d !== ',')
          for (const domain of domains) {
            const domainKey = this.cacheService.generateTenantKey(domain)
            this.cacheService.delete(domainKey)
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the operation
      console.error('Error invalidating organization cache:', error)
    }
  }
}
