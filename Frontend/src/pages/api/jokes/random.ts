import type { NextApiRequest, NextApiResponse } from 'next'

const BE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`${BE_URL}/jokes/random`)
  if (!response.ok) {
    return res.status(response.status).json({ error: 'Backend jokes request failed' })
  }

  const text = await response.text()
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.end(text)
}
