export interface ThreadCreateRequest {
  messages?: Array<{
    role: 'user' | 'assistant'
    content: string
    metadata?: Map<string, string>
  }>
  metadata?: Map<string, string>
}
