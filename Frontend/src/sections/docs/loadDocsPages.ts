import fs from 'fs'
import path from 'path'

import { DocsPages } from './docsPages.interface'

export function loadDocsPages(): DocsPages {
  const docsPagesPath = path.join(process.cwd(), '.docs-build', 'docs-pages.json')
  return JSON.parse(fs.readFileSync(docsPagesPath, 'utf8')) as DocsPages
}
