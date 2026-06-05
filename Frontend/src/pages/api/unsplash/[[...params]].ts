import type { NextApiRequest, NextApiResponse } from 'next'

const BE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { params: paramStringOrArray = [] } = req.query
  const params = Array.isArray(paramStringOrArray) ? paramStringOrArray : [paramStringOrArray]

  let width = '300'
  let height = '200'
  let queryParts: string[] = []

  if (params.length > 0 && /^\d+x\d+$/.test(params[0])) {
    ;[width, height] = params[0].split('x')
    queryParts = params.slice(1)
  } else {
    queryParts = params
  }

  const query = queryParts.join(' ').replace(/,/g, ' ')

  const url = `${BE_URL}/unsplash/image?width=${width}&height=${height}${query ? `&query=${encodeURIComponent(query)}` : ''}`

  const response = await fetch(url)
  if (!response.ok) {
    return res.status(response.status).json({ error: 'Backend unsplash request failed' })
  }

  const buffer = await response.arrayBuffer()
  res.setHeader('Content-Type', 'image/jpeg')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(buffer)
}
