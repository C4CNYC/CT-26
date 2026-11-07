// What either code runner returns; BrowserViewEx turns it into the results box and checkers
export type CodeRunResult = {
  err?: string
  msg?: string
  stdout?: string
  output?: { all: 'Passed' | 'Failed'; passed: string[]; failed: string[] }
}
