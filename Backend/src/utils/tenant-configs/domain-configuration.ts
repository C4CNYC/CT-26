import { func } from "joi"

interface ITenantConfig {
  slug: string
  name: string
  senderEmail: string
  senderName: string
  defaultLanguage: string
}

 const domainConfiguration = {
  codejika: {
    slug: 'codejika',
    name: 'app.codejika.name',
    senderEmail: 'hello@codetribe.com',
    senderName: 'Jessica @CodeJIKA',
    defaultLanguage: 'en',
  },
  codetribe: {
    slug: 'codetribe',
    name: 'app.codetribe.com',
    senderEmail: 'hello@codetribe.com',
    senderName: 'Jessica @CodeTribe',
    defaultLanguage: 'en',
  },
} //as Record<string, ITenantConfig>

export function getTenantConfig(tenantName: string): ITenantConfig {
  if (tenantName in domainConfiguration) {
    return domainConfiguration[tenantName as keyof typeof domainConfiguration]
  } else {
    return domainConfiguration.codejika // default configuration
  }
}
export default domainConfiguration;