export interface OpenAICreateAssistantDTO {
  model: string // Required: ID of the model to use
  name?: string | null // Name of the assistant (max 256 characters)
  description?: string | null // Description of the assistant (max 512 characters)
  instructions?: string | null // System instructions for the assistant (max 256,000 characters)
  tools?:
    | Array<{
        type: 'code_interpreter' | 'file_search' | 'function' // Type of tool
        tool_resources?: { [key: string]: any } | null // Resources specific to tool type
      }>
    | [] // List of tools enabled on the assistant (max 128 tools)
  metadata?: { [key: string]: string } // Set of 16 key-value pairs for additional information
  temperature?: number | null // Sampling temperature between 0 and 2 (default: 1)
  top_p?: number | null // Nucleus sampling, considers top_p probability mass (default: 1)
  response_format?: string | { type: string; json_schema?: object } // Format for the model’s output
}
