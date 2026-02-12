import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'

import appConfig from '@/config/app.config'
import sendgridConfig from '@/config/sendgrid.config'
import { getTenantConfig } from '@/utils/tenant-configs/domain-configuration'

import { SendgridService } from '../../../providers/sendgrid/sendgrid.service'
import { ApplicationEventEnum } from '../users-manager/enums/application-event'

@Injectable()
export class EmailsManagerService {
  private readonly config: ConfigType<typeof appConfig>
  private readonly sgConfig: ConfigType<typeof sendgridConfig>

  constructor(
    private sendgridService: SendgridService,
    @Inject(appConfig.KEY)
    config: ConfigType<typeof appConfig>,
    @Inject(sendgridConfig.KEY)
    sgConfig: ConfigType<typeof sendgridConfig>,
  ) {
    this.config = config
    this.sgConfig = sgConfig
  }

  @OnEvent(ApplicationEventEnum.INVITE_USER)
  async sendInviteUser(
    email: string,
    invite_id: string,
    tenant_name: string,
  ): Promise<void> {
    const config = getTenantConfig(tenant_name)
    const link = this.config.fallbackClientBaseUrl
    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.inviteTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            slug: config.slug,
            link,
            buttonLink:
              link + `/invite?id=${invite_id}&tenant_name=${tenant_name}`,
          },
        },
      ],
    }
    await this.sendgridService.send(message)
  }

  @OnEvent(ApplicationEventEnum.INVITE_TEACHER_TO_SCHOOL)
  async sendInviteTeacherToSchool(
    email: string,
    invite_code: string,
    tenant_name: string,
    school_name: string,
  ): Promise<void> {
    const config = getTenantConfig(tenant_name)
    const link = this.config.fallbackClientBaseUrl
    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.inviteTeacherToSchoolTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            slug: config.slug,
            link,
            tenant_name,
            school_name,
            buttonLink: link + `/invite-v2?code=${invite_code}`,
          },
        },
      ],
    }
    await this.sendgridService.send(message)
  }

  @OnEvent(ApplicationEventEnum.FEEDBACK)
  async sendFeedback(email: string, tenant_name: string): Promise<void> {
    const config = getTenantConfig(tenant_name)
    const link = this.config.fallbackClientBaseUrl
    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.inviteTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            slug: config.slug,
            link,
            buttonLink: link + `/invite`,
          },
        },
      ],
    }
    await this.sendgridService.send(message)
  }

  @OnEvent(ApplicationEventEnum.INVITE_STUDENT_CODE)
  async inviteStudentCode(
    email: string,
    code: number,
    tenant_name: string,
  ): Promise<void> {
    const config = getTenantConfig(tenant_name)
    const link = this.config.fallbackClientBaseUrl
    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.inviteStudentCode,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            slug: config.slug,
            link: `${link}/auth/register?code=${code}`,
            code,
          },
        },
      ],
    }
    await this.sendgridService.send(message)
  }

  @OnEvent(ApplicationEventEnum.CREATE_ORG)
  async createOrganization(email: string, tenant_name: string): Promise<void> {
    const config = getTenantConfig(tenant_name)

    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.createOrgTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            slug: config.slug,
          },
        },
      ],
    }
    await this.sendgridService.send(message)
  }
  @OnEvent(ApplicationEventEnum.CREATE_TENANT)
  async createTenant(
    email: string,
    tenant_name: string,
    subdomain: string,
    brandName: string,
  ): Promise<void> {
    const config = getTenantConfig(tenant_name)

    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.createTenantTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            subdomain,
            brandName,
          },
        },
      ],
    }

    await this.sendgridService.send(message)
  }
  @OnEvent(ApplicationEventEnum.CREATE_STUDENT)
  async createStudent(email: string): Promise<void> {
    // const link = this.configService.get("FALLBACK_CLIENT_BASE_URL");
    const message = {
      from: {
        email: this.sgConfig.emailFrom,
        name: this.sgConfig.nameFrom,
      },
      templateId: this.sgConfig.createStudentTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {},
        },
      ],
    }
    const whiteMailProviders = this.sgConfig.emailWhitelist4Students.split(',')
    let foundProviders: string[] = []
    if (whiteMailProviders.length) {
      foundProviders = whiteMailProviders.filter((mail) => email.includes(mail))
    }
    if (foundProviders.length) await this.sendgridService.send(message)
  }

  @OnEvent(ApplicationEventEnum.INVITE_STUDENT)
  async sendInviteStudent(
    email: string,
    temprorary_password: string,
    school_name: string,
    tenant_name: string,
  ): Promise<void> {
    const config = getTenantConfig(tenant_name)
    const link = this.config.fallbackClientBaseUrl
    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.inviteStudentTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            slug: config.slug,
            school_name,
            temprorary_password,
            link,
          },
        },
      ],
    }
    await this.sendgridService.send(message)
  }

  @OnEvent(ApplicationEventEnum.RESET_STUDENT_PASSWORD)
  async sendResetPasswordStudent(
    email: string,
    reset_id: string,
    tenant_name: string,
    referrer: string,
  ): Promise<void> {
    const config = getTenantConfig(tenant_name)

    const message = {
      from: {
        email: config.senderEmail,
        name: config.senderName,
      },
      templateId: this.sgConfig.resetPasswordStudentTemplateId,
      personalizations: [
        {
          to: email,
          dynamicTemplateData: {
            slug: config.slug,
            buttonLink: referrer + `/auth/submit-password?id=${reset_id}`,
          },
        },
      ],
    }
    const sendGridResponse = await this.sendgridService.send(message)
    console.log('sendGridResponse', sendGridResponse)
  }
}
