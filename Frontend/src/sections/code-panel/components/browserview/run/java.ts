import { CodeRunResult } from './codeRunResult'

// Java runs on Judge0, through the n8n CodeRunner webhook
export function runJavaOnJudge0(code: string): Promise<CodeRunResult> {
  return fetch('https://ct26n8n.codetribe.ai/webhook/CodeRunner', {
    method: 'POST',
    headers: {
      'x-school-id': '6e81fc6a-ffc0-4e07-b84b-d415d524d6df',
      'x-tenant-id': 'codetribe',
    },
    body: JSON.stringify({
      prompt: { code, language: 'java' },
      endPointPath: 'CodeRunner',
    }),
  }).then((r) => r.json())
}
