export interface DocsHeading {
  id: string
  text: string
}

export interface DocsPage {
  route: string
  markdownPath: string
  title: string
  description: string
  html: string
  headings: DocsHeading[]
}

export interface DocsGuide extends DocsPage {
  order: number
  verified: string
}

export interface DocsSection {
  folder: string
  title: string
  guides: DocsGuide[]
}

export interface DocsPages {
  home: DocsPage
  sections: DocsSection[]
}

export interface DocsSidebarSection {
  title: string
  guides: Pick<DocsGuide, 'route' | 'title'>[]
}
