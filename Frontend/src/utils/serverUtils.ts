import { DEFAULT_TENANT, Tenant } from '@/redux/slices/tenant'

const POSITIVE_TTL_MS = 5 * 60 * 1000
const NEGATIVE_TTL_MS = 30 * 1000

interface CacheEntry {
  value: Tenant
  ts: number
  negative: boolean
}

const tenantCache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<Tenant>>()

function isServer(): boolean {
  return typeof window === 'undefined'
}

async function fetchTenantFromApi(domain: string): Promise<Tenant> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant/${domain}`)
    if (!res.ok) return DEFAULT_TENANT
    const data = await res.json()

    if (data && !data.error && data.slug) return data
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error loading tenant:', err)
  }

  return DEFAULT_TENANT
}

export async function getTenantByDomain(domain: string): Promise<Tenant> {
  if (!isServer()) {
    return fetchTenantFromApi(domain)
  }

  const now = Date.now()
  const cached = tenantCache.get(domain)
  if (cached) {
    const ttl = cached.negative ? NEGATIVE_TTL_MS : POSITIVE_TTL_MS
    if (now - cached.ts < ttl) {
      return cached.value
    }
    tenantCache.delete(domain)
  }

  const pending = inflight.get(domain)
  if (pending) return pending

  const promise = (async () => {
    const value = await fetchTenantFromApi(domain)
    tenantCache.set(domain, {
      value,
      ts: Date.now(),
      negative: value === DEFAULT_TENANT,
    })
    return value
  })()

  inflight.set(domain, promise)
  try {
    return await promise
  } finally {
    inflight.delete(domain)
  }
}
