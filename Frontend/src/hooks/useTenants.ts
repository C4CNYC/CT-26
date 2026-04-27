import { useEffect, useState } from 'react'

import { DEFAULT_TENANT, Tenant } from '../redux/slices/tenant'

function getDomain() {
  if (typeof window === 'object') {
    let domain = window.location.hostname
    if (domain) {
      return domain === 'localhost' ? 'codetribe' : domain
    }
  }
  return 'codetribe'
}

async function fetchTenant(domain: string): Promise<Tenant> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant/${domain}`)
    if (!res.ok) {
      return DEFAULT_TENANT
    }
    const data = await res.json()
    if (data && !data.error && data.slug) return data
  } catch (e) {
    // console.error('Failed to fetch tenant', e)
  }
  return DEFAULT_TENANT
}

let isFetching = false
let fetchPromise: Promise<Tenant> | null = null

export function useTenants() {
  const [tenant, setTenant] = useState<Tenant | undefined>(undefined)

  useEffect(() => {
    let savedTenant: Tenant | null = null
    try {
      const json = localStorage.getItem('tenant')
      savedTenant = json ? JSON.parse(json) : null
    } catch {}

    if (savedTenant) {
      setTenant(savedTenant)
      return
    }

    const tenantName = localStorage.getItem('tenantName')
    const domain = tenantName || getDomain()

    if (isFetching && fetchPromise) {
      fetchPromise.then((fetchedTenant) => {
        setTenant(fetchedTenant)
        localStorage.setItem('tenant', JSON.stringify(fetchedTenant))
        localStorage.setItem('tenantName', fetchedTenant.slug)
      })
      return
    }

    isFetching = true
    fetchPromise = fetchTenant(domain)

    fetchPromise.then((fetchedTenant) => {
      isFetching = false
      fetchPromise = null
      setTenant(fetchedTenant)
      localStorage.setItem('tenant', JSON.stringify(fetchedTenant))
      localStorage.setItem('tenantName', fetchedTenant.slug)
    })
  }, [])

  return tenant
}
