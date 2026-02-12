export interface OaiMessage {
  id: string
  object: string
  created_at: number
  thread_id: string
  status: 'incomplete' | 'completed' | 'in_progress'
  incomplete_details: { reason: string } | null
  completed_at: number | null
  incomplete_at: number | null
  role: 'user' | 'assistant'
  content: Array<
    | { type: 'text'; text: { value: string; annotations: any[] } }
    | { type: 'image_file'; image_file: { file_id: string; detail: string } }
    | object
  >
  assistant_id: string | null
  run_id: string | null
  attachments: Array<object> | null
  metadata: Map<string, string>
}
