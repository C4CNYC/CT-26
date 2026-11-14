import { GetStaticPaths, GetStaticProps } from 'next'

import DocsPageLayout from '@/sections/docs/DocsPageLayout'
import { DocsPage, DocsSidebarSection } from '@/sections/docs/docsPages.interface'
import { loadDocsPages } from '@/sections/docs/loadDocsPages'

interface DocsRouteProps {
  page: DocsPage
  sidebar: DocsSidebarSection[]
}

export default function DocsRoute({ page, sidebar }: DocsRouteProps) {
  return (
    <DocsPageLayout
      page={page}
      sidebar={sidebar}
    />
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const { sections } = loadDocsPages()
  const guidePaths = sections.flatMap((section) =>
    section.guides.map((guide) => ({ params: { slug: guide.route.split('/').slice(2) } }))
  )
  return { paths: [{ params: { slug: [] } }, ...guidePaths], fallback: false }
}

export const getStaticProps: GetStaticProps<DocsRouteProps> = ({ params }) => {
  const { home, sections } = loadDocsPages()
  const slug = (params?.slug as string[] | undefined) ?? []
  const route = ['/docs', ...slug].join('/')
  const page =
    route === '/docs'
      ? home
      : sections.flatMap((section) => section.guides).find((guide) => guide.route === route)
  if (!page) return { notFound: true }
  const sidebar = sections
    .filter((section) => section.guides.length > 0)
    .map((section) => ({
      title: section.title,
      guides: section.guides.map(({ route: guideRoute, title }) => ({ route: guideRoute, title })),
    }))
  return { props: { page, sidebar } }
}
