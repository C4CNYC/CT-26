import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'

import unsplashConfig from '@/config/unsplash.config'

const MAX_RAW_SIZE = 640
const MAX_DISK_MB = 500
const LRU_MAX = 200
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'unsplash')

interface UnsplashPhoto {
  id: string
  urls: { raw: string }
}

interface CacheEntry {
  photo: UnsplashPhoto
  timestamp: number
}

@Injectable()
export class UnsplashService {
  private readonly logger = new Logger(UnsplashService.name)
  private readonly lru = new Map<string, CacheEntry>()

  constructor(
    @Inject(unsplashConfig.KEY)
    private readonly config: ConfigType<typeof unsplashConfig>,
  ) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }

  async getImage(query: string, width: number, height: number): Promise<Buffer> {
    const photo = await this.fetchPhoto(query)
    const rawPath = path.join(STORAGE_DIR, `${photo.id}.jpg`)

    await this.ensureRawOnDisk(photo, rawPath)
    this.evictIfNeeded()

    const w = Math.min(width, MAX_RAW_SIZE)
    const h = Math.min(height, MAX_RAW_SIZE)

    return sharp(rawPath)
      .resize(w, h, { fit: 'cover' })
      .jpeg()
      .toBuffer()
  }

  private async fetchPhoto(query: string): Promise<UnsplashPhoto> {
    const cacheKey = query || '__random__'
    const cached = this.lru.get(cacheKey)
    if (cached) {
      this.lru.delete(cacheKey)
      this.lru.set(cacheKey, cached)
      return cached.photo
    }

    const endpoint = `https://api.unsplash.com/photos/random?${query ? `query=${encodeURIComponent(query)}&` : ''}client_id=${this.config.accessKey}`
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
    }

    const photo = (await response.json()) as UnsplashPhoto

    this.lru.set(cacheKey, { photo, timestamp: Date.now() })
    if (this.lru.size > LRU_MAX) {
      const firstKey = this.lru.keys().next().value
      if (firstKey !== undefined) this.lru.delete(firstKey)
    }

    this.logger.log(`Fetched photo ${photo.id} for query "${query}"`)
    return photo
  }

  private async ensureRawOnDisk(photo: UnsplashPhoto, rawPath: string): Promise<void> {
    if (fs.existsSync(rawPath)) return

    const url = `${photo.urls.raw}&w=${MAX_RAW_SIZE}&h=${MAX_RAW_SIZE}&fit=crop&q=80`
    const imageResponse = await fetch(url)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`)
    }

    const arrayBuffer = await imageResponse.arrayBuffer()
    fs.writeFileSync(rawPath, Buffer.from(arrayBuffer))
    this.logger.log(`Saved raw image ${photo.id} to disk`)
  }

  private evictIfNeeded(): void {
    const files = fs.readdirSync(STORAGE_DIR)
    let totalBytes = 0

    for (const file of files) {
      try {
        const stat = fs.statSync(path.join(STORAGE_DIR, file))
        totalBytes += stat.size
      } catch {}
    }

    const maxBytes = MAX_DISK_MB * 1024 * 1024
    if (totalBytes < maxBytes) return

    const sorted = files
      .map((f) => ({ name: f, mtime: fs.statSync(path.join(STORAGE_DIR, f)).mtimeMs }))
      .sort((a, b) => a.mtime - b.mtime)

    const toDelete = Math.ceil(sorted.length * 0.25)
    for (let i = 0; i < toDelete; i++) {
      try {
        fs.unlinkSync(path.join(STORAGE_DIR, sorted[i].name))
      } catch {}
    }

    this.logger.log(`Evicted ${toDelete} images from disk (was ${Math.round(totalBytes / 1024 / 1024)}MB)`)
  }
}
