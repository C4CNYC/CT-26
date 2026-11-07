// Runs a prepared Python program (see prepare/python.ts) in the browser with Pyodide,
// inside a Web Worker so a stuck loop can be stopped. Resolves with the same shape the
// CodeRunner webhook returns: { err, stdout, output }.

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/'
const LOAD_TIMEOUT_MS = 60000 // first run downloads Pyodide, which is slow on weak connections
const RUN_TIMEOUT_MS = 10000

export type PythonRunResult = {
  err?: string
  stdout?: string
  output?: { all: 'Passed' | 'Failed'; passed: string[]; failed: string[] }
}

const workerSource = `
importScripts('${PYODIDE_URL}pyodide.js')
const ready = loadPyodide({ indexURL: '${PYODIDE_URL}' })

onmessage = async (event) => {
  const pyodide = await ready
  postMessage({ started: true })
  let stdout = ''
  let stderr = ''
  pyodide.setStdout({ batched: (line) => (stdout += line + '\\n') })
  pyodide.setStderr({ batched: (line) => (stderr += line + '\\n') })
  const scope = pyodide.globals.get('dict')()
  try {
    pyodide.runPython(event.data, { globals: scope })
    const output = JSON.parse(pyodide.runPython('import json\\njson.dumps(main())', { globals: scope }))
    postMessage({ stdout, err: stderr, output })
  } catch (error) {
    postMessage({ stdout, err: stderr + String(error && error.message ? error.message : error) })
  } finally {
    scope.destroy()
  }
}
`

let worker: Worker | null = null

function getWorker() {
  if (!worker) {
    const url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }))
    worker = new Worker(url)
  }
  return worker
}

function resetWorker() {
  worker?.terminate()
  worker = null
}

export function runPython(code: string): Promise<PythonRunResult> {
  return new Promise((resolve) => {
    const current = getWorker()
    const fail = (err: string) => {
      clearTimeout(timer)
      resetWorker()
      resolve({ err })
    }
    let timer = setTimeout(
      () => fail('Python took too long to load. Check your connection and run again.'),
      LOAD_TIMEOUT_MS
    )

    current.onmessage = (event: MessageEvent) => {
      if (event.data?.started) {
        clearTimeout(timer)
        timer = setTimeout(
          () => fail(`Your code ran for more than ${RUN_TIMEOUT_MS / 1000} seconds and was stopped.`),
          RUN_TIMEOUT_MS
        )
        return
      }
      clearTimeout(timer)
      resolve(event.data as PythonRunResult)
    }
    current.onerror = (event: ErrorEvent) => fail(event.message || 'Python could not start.')
    current.postMessage(code)
  })
}
