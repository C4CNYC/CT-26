import Script from 'next/script'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export default function GoogleAnalytics(): React.ReactElement {
  return (
    <>
      <Script
        id='gtm-dataLayer-init'
        strategy='lazyOnload'
      >
        {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });`}
      </Script>
      <Script
        src='https://www.googletagmanager.com/gtm.js?id=GTM-MLV7CSKG'
        strategy='lazyOnload'
      />
    </>
  )
}
