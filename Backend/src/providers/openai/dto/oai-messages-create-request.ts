export interface OaiMessagesCreateRequest {
  role: 'user' | 'assistant'
  content: string
  metadata: Map<string, string>
}
