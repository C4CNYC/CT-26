export interface AssistantListResponse {
  id: string
  object: string
  created_at: number
  name: string | null
  description: string | null
  model: string
  instructions: string | null
  tools: string[]
  tool_resources: object | null
  metadata: Map<string, string>
  temperature: number | null
  top_p: number | null
  response_format: { type: string; json_schema: object }
}
