import { CodeRunResult } from './codeRunResult'

// Python runs in the browser with MicroPython (~185 KB, downloaded only when a Python lesson is
// run), inside a Web Worker so a stuck loop can be stopped.
const LOAD_TIMEOUT_MS = 60000 // generous, for slow phone connections
const RUN_TIMEOUT_MS = 10000

let pythonWorker: Worker | null = null

function getPythonWorker() {
  if (!pythonWorker) pythonWorker = new Worker(new URL('./python.worker.ts', import.meta.url))
  return pythonWorker
}

function stopPythonWorker() {
  pythonWorker?.terminate()
  pythonWorker = null
}

export function runPythonInBrowser(code: string): Promise<CodeRunResult> {
  return new Promise((resolve) => {
    const worker = getPythonWorker()
    const fail = (err: string) => {
      clearTimeout(timer)
      stopPythonWorker()
      resolve({ err })
    }
    let timer = setTimeout(
      () => fail('Python took too long to load. Check your connection and run again.'),
      LOAD_TIMEOUT_MS
    )

    worker.onmessage = (event: MessageEvent) => {
      if (event.data?.started) {
        clearTimeout(timer)
        timer = setTimeout(
          () => fail(`Your code ran for more than ${RUN_TIMEOUT_MS / 1000} seconds and was stopped.`),
          RUN_TIMEOUT_MS
        )
        return
      }
      clearTimeout(timer)
      resolve(event.data as CodeRunResult)
    }
    worker.onerror = (event: ErrorEvent) => fail(event.message || 'Python could not start.')
    worker.postMessage(code)
  })
}
