import { useEffect, useRef } from 'react'

import NextLink from 'next/link'

import styles from './docs.module.css'
import { DocsHeading, DocsSidebarSection } from './docsPages.interface'

interface DocsSidebarProps {
  sidebar: DocsSidebarSection[]
  currentRoute: string
  headings: DocsHeading[]
}

export default function DocsSidebar({ sidebar, currentRoute, headings }: DocsSidebarProps) {
  const foldRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (foldRef.current && window.matchMedia('(max-width: 899px)').matches)
      foldRef.current.open = false
  }, [currentRoute])

  return (
    <nav
      className={styles.docsSidebar}
      aria-label='Docs'
    >
      <details
        ref={foldRef}
        open
        className={styles.docsSidebarFold}
      >
        <summary>Browse the docs</summary>
        <NextLink
          href='/docs'
          aria-current={currentRoute === '/docs' ? 'page' : undefined}
        >
          Docs home
        </NextLink>
        {sidebar.map((section) => (
          <div key={section.title}>
            <p className={styles.docsSidebarSectionTitle}>{section.title}</p>
            <ul>
              {section.guides.map((guide) => (
                <li key={guide.route}>
                  <NextLink
                    href={guide.route}
                    aria-current={guide.route === currentRoute ? 'page' : undefined}
                  >
                    {guide.title}
                  </NextLink>
                  {guide.route === currentRoute && headings.length > 0 && (
                    <ul className={styles.docsSidebarHeadings}>
                      {headings.map((heading) => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`}>{heading.text}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </details>
    </nav>
  )
}
