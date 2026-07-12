import Head from 'next/head'
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export default function GoogleAnalytics(): React.ReactElement {
  useEffect(() => {
    const init = (): void => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      })
      const f = document.getElementsByTagName('script')[0]
      const j = document.createElement('script')
      j.async = true
      j.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MLV7CSKG'
      f?.parentNode?.insertBefore(j, f) ?? document.head.appendChild(j)
    }

    const supportsRic = 'requestIdleCallback' in window
    const handle = supportsRic
      ? (window as any).requestIdleCallback(init, { timeout: 5000 })
      : (window as any).setTimeout(init, 3000)

    return (): void => {
      if (supportsRic) (window as any).cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [])

  return (
    <Head>
      <link
        rel='preconnect'
        href='https://www.googletagmanager.com'
      />
    </Head>
  )
}
