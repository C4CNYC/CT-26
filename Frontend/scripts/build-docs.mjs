import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import MarkdownIt from 'markdown-it'

const FRONTEND_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public')
const DOCS_SOURCE_DIR = path.join(PUBLIC_DIR, 'docs')
const DOCS_BUILD_DIR = path.join(FRONTEND_DIR, '.docs-build')
const DOCS_SITE_URL = 'https://codetribe.ai'

const DOCS_SECTIONS = [
  { folder: 'getting-started', title: 'Getting started' },
  { folder: 'teaching', title: 'Teaching' },
  { folder: 'creating-content', title: 'Creating content' },
  { folder: 'learning', title: 'Learning' },
  { folder: 'organization', title: 'Organization' },
]

const HOME_KEYS = ['title', 'description']
const GUIDE_KEYS = ['title', 'description', 'order', 'verified']
const GENERATED_PUBLIC_FILES = new Set(['/llms.txt', '/llms-full.txt'])

const problems = []

function relativeToFrontend(filePath) {
  return path.relative(FRONTEND_DIR, filePath)
}

function readFrontMatterAndBody(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n')
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    problems.push(`${relativeToFrontend(filePath)}: no front matter`)
    return { frontMatter: {}, body: text }
  }
  const frontMatter = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    frontMatter[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  return { frontMatter, body: match[2].trim() }
}

function checkFrontMatter(filePath, frontMatter, requiredKeys) {
  for (const key of requiredKeys)
    if (!frontMatter[key]) problems.push(`${relativeToFrontend(filePath)}: missing "${key}"`)
  if (frontMatter.order !== undefined && !/^\d+$/.test(frontMatter.order))
    problems.push(`${relativeToFrontend(filePath)}: "order" must be a whole number`)
  if (frontMatter.verified !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(frontMatter.verified))
    problems.push(`${relativeToFrontend(filePath)}: "verified" must be a date like 2026-11-14`)
}

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createDocsMarkdownRenderer() {
  const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false })
  markdown.core.ruler.push('docs_heading_ids', (state) => {
    const usedIds = new Set()
    state.env.headings = []
    state.tokens.forEach((token, index) => {
      if (token.type !== 'heading_open' || !['h2', 'h3'].includes(token.tag)) return
      const text = state.tokens[index + 1].children
        .filter((child) => child.type === 'text' || child.type === 'code_inline')
        .map((child) => child.content)
        .join('')
      let id = slugifyHeading(text)
      for (let suffix = 2; usedIds.has(id); suffix++) id = `${slugifyHeading(text)}-${suffix}`
      usedIds.add(id)
      token.attrSet('id', id)
      if (token.tag === 'h2') state.env.headings.push({ id, text })
    })
  })
  const renderImage = markdown.renderer.rules.image
  markdown.renderer.rules.image = (tokens, index, options, env, renderer) => {
    const token = tokens[index]
    token.attrSet('loading', 'lazy')
    const displaySize = readScreenshotDisplaySize(token.attrGet('src'))
    if (displaySize) {
      token.attrSet('width', String(displaySize.width))
      token.attrSet('height', String(displaySize.height))
    }
    return renderImage(tokens, index, options, env, renderer)
  }
  return markdown
}

function readScreenshotDisplaySize(src) {
  const filePath = path.join(PUBLIC_DIR, src)
  if (!src.startsWith('/') || !src.endsWith('.png') || !fs.existsSync(filePath)) return null
  const pngHeader = fs.readFileSync(filePath).subarray(16, 24)
  return {
    width: Math.round(pngHeader.readUInt32BE(0) / 2),
    height: Math.round(pngHeader.readUInt32BE(4) / 2),
  }
}

function collectReferences(markdown, body) {
  const references = []
  const visit = (tokens) => {
    for (const token of tokens) {
      if (token.type === 'link_open')
        references.push({ kind: 'link', target: token.attrGet('href') })
      if (token.type === 'image') references.push({ kind: 'image', target: token.attrGet('src') })
      if (token.children) visit(token.children)
    }
  }
  visit(markdown.parse(body, {}))
  return references
}

function checkReferences(filePath, references, docsRoutes) {
  for (const { kind, target } of references) {
    if (!target.startsWith('/')) continue
    const targetPath = target.split(/[?#]/)[0]
    const isPublicFile =
      GENERATED_PUBLIC_FILES.has(targetPath) || fs.existsSync(path.join(PUBLIC_DIR, targetPath))
    if (kind === 'image' && !isPublicFile)
      problems.push(`${relativeToFrontend(filePath)}: image not found: ${target}`)
    if (kind === 'image' && !targetPath.endsWith('.png'))
      problems.push(`${relativeToFrontend(filePath)}: screenshots must be PNG: ${target}`)
    if (
      kind === 'link' &&
      targetPath.startsWith('/docs') &&
      !docsRoutes.has(targetPath) &&
      !isPublicFile
    )
      problems.push(`${relativeToFrontend(filePath)}: broken docs link: ${target}`)
  }
}

function readDocsSources() {
  const knownFolders = new Set(DOCS_SECTIONS.map((section) => section.folder))
  for (const entry of fs.readdirSync(DOCS_SOURCE_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && !knownFolders.has(entry.name))
      problems.push(`public/docs/${entry.name}: not one of the sections in scripts/build-docs.mjs`)
    if (entry.isFile() && entry.name !== 'index.md')
      problems.push(`public/docs/${entry.name}: guides go in a section folder`)
  }

  const homePath = path.join(DOCS_SOURCE_DIR, 'index.md')
  const home = {
    ...readFrontMatterAndBody(homePath),
    filePath: homePath,
    route: '/docs',
    markdownPath: '/docs/index.md',
  }
  checkFrontMatter(homePath, home.frontMatter, HOME_KEYS)

  const sections = DOCS_SECTIONS.map((section) => {
    const folderPath = path.join(DOCS_SOURCE_DIR, section.folder)
    const fileNames = fs.existsSync(folderPath)
      ? fs.readdirSync(folderPath).filter((fileName) => fileName.endsWith('.md'))
      : []
    const guides = fileNames.map((fileName) => {
      const filePath = path.join(folderPath, fileName)
      const guide = readFrontMatterAndBody(filePath)
      checkFrontMatter(filePath, guide.frontMatter, GUIDE_KEYS)
      const route = `/docs/${section.folder}/${fileName.replace(/\.md$/, '')}`
      return { ...guide, filePath, route, markdownPath: `${route}.md` }
    })
    guides.sort(
      (first, second) => Number(first.frontMatter.order) - Number(second.frontMatter.order)
    )
    return { ...section, guides }
  })
  return { home, sections }
}

function renderDocsPages(markdown, home, sections) {
  const docsRoutes = new Set([
    home.route,
    ...sections.flatMap((section) => section.guides.map((guide) => guide.route)),
  ])
  const renderPage = (page) => {
    checkReferences(page.filePath, collectReferences(markdown, page.body), docsRoutes)
    const env = {}
    const html = markdown.render(page.body, env)
    return {
      route: page.route,
      markdownPath: page.markdownPath,
      title: page.frontMatter.title ?? '',
      description: page.frontMatter.description ?? '',
      html,
      headings: env.headings ?? [],
    }
  }
  return {
    home: renderPage(home),
    sections: sections.map((section) => ({
      folder: section.folder,
      title: section.title,
      guides: section.guides.map((guide) => ({
        ...renderPage(guide),
        order: Number(guide.frontMatter.order),
        verified: guide.frontMatter.verified ?? '',
      })),
    })),
  }
}

function buildLlmsTxt(home, sections) {
  const lines = [
    `# ${home.frontMatter.title}`,
    '',
    `> ${home.frontMatter.description}`,
    '',
    "Each guide is a Markdown file: add `.md` to a guide's address to read it.",
  ]
  for (const section of sections.filter((candidate) => candidate.guides.length)) {
    lines.push('', `## ${section.title}`, '')
    for (const guide of section.guides)
      lines.push(
        `- [${guide.frontMatter.title}](${DOCS_SITE_URL}${guide.markdownPath}): ${guide.frontMatter.description}`
      )
  }
  return `${lines.join('\n')}\n`
}

function buildLlmsFullTxt(home, sections) {
  const pages = [home, ...sections.flatMap((section) => section.guides)]
  const blocks = pages.map((page) =>
    [
      `# ${page.frontMatter.title}`,
      `Source: ${DOCS_SITE_URL}${page.markdownPath}`,
      '',
      page.frontMatter.description,
      '',
      page.body,
    ].join('\n')
  )
  return `${blocks.join('\n\n---\n\n')}\n`
}

const { home, sections } = readDocsSources()
const docsPages = renderDocsPages(createDocsMarkdownRenderer(), home, sections)

if (problems.length) {
  process.stderr.write(
    `build-docs: ${problems.length} problem(s)\n${problems.map((problem) => `- ${problem}`).join('\n')}\n`
  )
  process.exit(1)
}

fs.mkdirSync(DOCS_BUILD_DIR, { recursive: true })
fs.writeFileSync(path.join(DOCS_BUILD_DIR, 'docs-pages.json'), JSON.stringify(docsPages))
fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), buildLlmsTxt(home, sections))
fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), buildLlmsFullTxt(home, sections))

const guideCount = sections.reduce((count, section) => count + section.guides.length, 0)
process.stdout.write(
  `build-docs: ${guideCount} guide(s) written to .docs-build/docs-pages.json, public/llms.txt and public/llms-full.txt\n`
)
