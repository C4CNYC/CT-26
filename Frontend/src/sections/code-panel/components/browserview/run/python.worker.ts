// Web Worker started by run/python.ts. Runs a prepared Python program (prepare/python.ts)
// with MicroPython, served from our own /assets/js, and posts back a CodeRunResult.
const MICROPYTHON_URL = '/assets/js/micropython-1.26.0/micropython.mjs'

type MicroPython = {
  runPython: (code: string) => unknown
  globals: { get: (name: string) => unknown; set: (name: string, value: unknown) => void }
}

let micropython: Promise<MicroPython> | null = null
let stdout = ''
let stderr = ''

function loadMicroPythonOnce(): Promise<MicroPython> {
  if (!micropython) {
    micropython = import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ MICROPYTHON_URL
    ).then(({ loadMicroPython }) =>
      loadMicroPython({
        stdout: (line: string) => (stdout += line + '\n'),
        stderr: (line: string) => (stderr += line + '\n'),
        linebuffer: true,
      })
    )
  }
  return micropython
}

self.onmessage = async (event: MessageEvent<string>) => {
  const mp = await loadMicroPythonOnce()
  self.postMessage({ started: true })
  stdout = ''
  stderr = ''
  try {
    mp.globals.set('student_program', event.data)
    // each run gets a fresh namespace, so names from one run can't leak into the next
    mp.runPython(
      'import json\n' +
        'student_namespace = {}\n' +
        'exec(student_program, student_namespace)\n' +
        'test_results_json = json.dumps(student_namespace["main"]())'
    )
    let output = JSON.parse(mp.globals.get('test_results_json') as string)
    self.postMessage({ stdout, err: stderr, output })
  } catch (error) {
    self.postMessage({ stdout, err: stderr + (error instanceof Error ? error.message : String(error)) })
  }
}
