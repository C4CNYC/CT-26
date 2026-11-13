import {
  anthropic,
  type AnthropicLanguageModelOptions,
} from '@ai-sdk/anthropic'

const claudeOpusSettings = (
  effort: NonNullable<AnthropicLanguageModelOptions['effort']>,
) => ({
  model: anthropic('claude-opus-5-5'),
  providerOptions: {
    anthropic: {
      thinking: { type: 'adaptive' },
      effort,
      fallbacks: 'default',
    } satisfies AnthropicLanguageModelOptions,
  },
})

export const lessonGeneratorClaudeSettings = claudeOpusSettings('high')

export const slideEditorClaudeSettings = claudeOpusSettings('medium')

export const slideSuggestionsClaudeSettings = claudeOpusSettings('low')
