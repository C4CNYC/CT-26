export interface AssistantListRequest {
  limit?: number
  order?: 'asc' | 'desc'
  after?: string
  before?: string
}
