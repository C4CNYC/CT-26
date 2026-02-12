import OpenAI from 'openai'
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads.js'

import { AssistantListRequest } from './dto/assistant-list-request'
import { stripQuotesFromAiResponse } from '@/commons/utils/strip-quotes-from-ai-response'
import { MessageCreateParams } from 'openai/resources/beta/threads/messages.js'
import { RunCreateParamsNonStreaming } from 'openai/resources/beta/threads/runs/runs.js'

export class OpenAIService {
  public openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  async assistandList(params: AssistantListRequest) {
    return await this.openai.beta.assistants.list(params)
  }
  async threadCreate(params: ThreadCreateParams) {
    return await this.openai.beta.threads.create(params)
  }
  async MessagesCreateRequest(thread_id: string, params: MessageCreateParams) {
    return await this.openai.beta.threads.messages.create(thread_id, params)
  }
  async run(threadId: string, body: RunCreateParamsNonStreaming) {
    const runResponse = await this.openai.beta.threads.runs.createAndPoll(
      threadId,
      body,
    )

    const messages: OpenAI.Beta.Threads.Messages.Message[] = []
    if (runResponse.status === 'completed') {
      const messagesList = await this.openai.beta.threads.messages.list(
        runResponse.thread_id,
        { order: 'desc', limit: 1 },
      )
      for (const message of messagesList.data) {
        // we expect the first message to be the assistant's response
        // if ('text' in message.content[0])
        //     console.log(`${message.role} > ${message.content[0]?.text.value}`);
        messages.push(message)
      }
    }
    return messages
  }
  parseResponse(response: OpenAI.Beta.Threads.Messages.Message[]) {
    let responseText = ''
    if (
      !response ||
      response.length === 0 ||
      !response[0].content ||
      response[0].content.length === 0 ||
      !('text' in response[0].content[0])
    ) {
      console.log('OpenAi Response failed!', response)
    } else {
      responseText = stripQuotesFromAiResponse(
        response[0].content[0].text.value,
      )
    }
    return responseText
  }
}
