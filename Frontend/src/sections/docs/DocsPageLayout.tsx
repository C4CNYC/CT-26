import Head from 'next/head'
import NextLink from 'next/link'

import styles from './docs.module.css'
import { DocsPage, DocsSidebarSection } from './docsPages.interface'
import DocsSidebar from './DocsSidebar'

const DOCS_SITE_URL = 'https://codetribe.ai'

interface DocsPageLayoutProps {
  page: DocsPage
  sidebar: DocsSidebarSection[]
}

export default function DocsPageLayout({ page, sidebar }: DocsPageLayoutProps) {
  return (
    <>
      <Head>
        <title>{page.route === '/docs' ? page.title : `${page.title} | CodeTribe docs`}</title>
        <meta
          name='description'
          content={page.description}
        />
        <link
          rel='canonical'
          href={`${DOCS_SITE_URL}${page.route}`}
        />
        <link
          rel='alternate'
          type='text/markdown'
          href={page.markdownPath}
        />
      </Head>
      <div className={styles.docsShell}>
        <header className={styles.docsHeader}>
          <NextLink
            href='/docs'
            className={styles.docsHeaderHome}
          >
            CodeTribe <span className={styles.docsHeaderLabel}>Docs</span>
          </NextLink>
          <NextLink
            href='/'
            className={styles.docsHeaderAppLink}
          >
            Open the app
          </NextLink>
        </header>
        <main className={styles.docsLayout}>
          <DocsSidebar
            sidebar={sidebar}
            currentRoute={page.route}
            headings={page.headings}
          />
          <article className={styles.docsArticle}>
            <h1>{page.title}</h1>
            <p className={styles.docsLead}>{page.description}</p>
            <div
              className={styles.docsBody}
              dangerouslySetInnerHTML={{ __html: page.html }}
            />
            <p className={styles.docsSourceLinks}>
              <a href={page.markdownPath}>This page as Markdown</a> ·{' '}
              <a href='/llms.txt'>llms.txt</a>
            </p>
          </article>
        </main>
      </div>
    </>
  )
}
