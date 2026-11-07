import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger'

import { SignigRequestDto } from '@/api/old-auth/dtos/signin-request.dto'
import { SignupRequestDto } from '@/api/old-auth/dtos/signup-request.dto'
import { OrganizationSearchOptions } from '@/api/super-admin/organization-api/dtos/organization-search-options.dto'
import { UpdateOrganizationDto } from '@/api/super-admin/organization-api/dtos/update-organization.dto'
import { Organization } from '@/modules/core/organization/organization.entity'
import { Role } from '@/modules/core/user/enums/role.enum'
import { User } from '@/modules/core/user/user.entity'
import { OrganizationManagerService } from '@/modules/managers/organization-manger/organization-manger.service'
import { AuthUser } from '@/old-auth/decorators/user.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { LoginedUser } from '@/old-auth/interfaces/logined-user.interface'
import { MessageDto } from '@/utils/dtos/message.dto'
import { FILE_SCHEMA } from '@/utils/file-schema'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '@/utils/parser/parse-image.pipe'

import { AuthManagerService } from '../../../modules/managers/auth-manager/auth-manager.service'
import { SchoolMangerService } from '../../../modules/managers/school-manager/school-manager.service'
import { ApplicationEventEnum } from '../../../modules/managers/users-manager/enums/application-event'
import { TenantPublicApiService } from './tenant-public-api.service'
import { CacheInterceptor } from '@/utils/cache/cache.interceptor'

@ApiTags('School API (PUBLIC)')
@ApiHeader({ name: 'x-tenant-id' })
@Controller('tenant')
export class TenantPublicApiController {
  constructor(
    private tenantPublicApiService: TenantPublicApiService,
    private organizationMangerService: OrganizationManagerService,
    private authManagerService: AuthManagerService,
    private eventEmitter: EventEmitter2,
    private schoolManager: SchoolMangerService,
  ) { }

  @Get('/:domain')
  @UseInterceptors(CacheInterceptor)
  async getTenantInfo(@Param('domain') domain: string): Promise<Organization> {
    return await this.organizationMangerService.getBySlug(domain)
  }

  @Get('/:name/home-page')
  async getHomePage(
    @Param('name') name: string,
  ): Promise<Pick<Organization, 'home_page_body' | 'home_page_type'>> {
    return await this.organizationMangerService.getHomePage(name)
  }
  @Post('/register')
  async registerTenant(
    @Body() dto: SignigRequestDto, // because we need email and password
    @Req() req: RequestWithMeta,
  ): Promise<LoginedUser> {
    //only email and password
    const newDto = new SignupRequestDto()
    newDto.email = dto.email
    newDto.password = dto.password
    newDto.role = Role.Admin
    return await this.authManagerService.register(
      newDto,
      req.org_id,
      req.org_name,
    )
  }

  @Post('/upload-logo')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Request() request: RequestWithMeta,
    @UploadedFile(new ParseImagePipe(200_000)) file: Express.Multer.File,
    @AuthUser() userId: string,
  ): Promise<MessageDto> {
    return await this.tenantPublicApiService.updateAvatar(
      userId,
      file,
      request.org_id,
    )
  }

  @Post('/check-brand')
  @UseGuards(JwtAuthGuard)
  async checkBrandName(@Body() data: UpdateOrganizationDto) {
    const options = new OrganizationSearchOptions()
    options.name = data?.brandName || ''

    const organization = await this.organizationMangerService.getList(options)

    if (organization.data.length > 0) {
      return {
        message: 'Brand name is already taken',
        isAvailable: false,
      }
    }

    return {
      message: 'Brand name is available',
      isAvailable: true,
    }
  }

  @Post('/check-subdomain')
  @UseGuards(JwtAuthGuard)
  async checkSubdomain(@Body() data: UpdateOrganizationDto) {
    const { message, isAvailable } =
      await this.organizationMangerService.checkOrganizationSlugAvailability(
        data.subdomain,
      )

    return { message, isAvailable }
  }

  @Post('/update-info')
  @UseGuards(JwtAuthGuard)
  async updateOrganization(
    @Req() { user }: RequestWithMeta,
    @Body()
    data: UpdateOrganizationDto & {
      name: string
      surname: string
    },
  ): Promise<Organization> {
    const { slug, isAvailable, message } =
      await this.organizationMangerService.checkOrganizationSlugAvailability(
        data.subdomain,
      )
    if (!isAvailable) throw new ConflictException(message)

    data.slug = slug
    data.subdomain = slug
    data.min_logo = data.logo
    data.domain = `,${slug}.codetribe.ai,`

    const organization =
      await this.organizationMangerService.createOrganization(
        {
          ...data,
          name: data?.brandName,
        },
        user.id,
      )
    // @ts-expect-error we just need partial of update
    const newDto: User = {
      id: user.id,
      first_name: data.name,
      last_name: data.surname,
      organization: organization,
    }
    await this.authManagerService.updateProfile(user, newDto)
    await this.schoolManager.updateOrgIdForSchool(user.id, organization.id)

    this.eventEmitter.emit(
      ApplicationEventEnum.CREATE_TENANT,
      user.email,
      data.name,
      data.subdomain,
      data.brandName,
    )
    return organization
  }
}
