export interface SlideDraft {
  title: string
  body: string
  starterFiles: { name: string; extension: string; code: string }[]
  solutionCode: string
  checkers: { name: string; regex: string; type?: string | null }[]
}

export interface SlideCheckResult {
  passed: boolean
  problems: string[]
}

export type LessonFinishCheckResult = SlideCheckResult

export interface LessonSlideCountRange {
  min: number
  max: number
}

const CHECKER_TYPES_THE_CODE_PANEL_DOES_NOT_EVALUATE = [
  'output',
  'execute',
  'manual',
]

const REGEX_LITERAL_LINE_BREAKS = ['\n', '\r', '\u2028', '\u2029']

const EXTERNAL_SCRIPT_TAG_REGEX =
  /<script\b[^>]*\ssrc\s*=\s*["']?\s*(?:https?:)?\/\//i

const PARENT_OR_TOP_WINDOW_REFERENCE_REGEX =
  /\bwindow\.(?:parent|top)\b|(?<![\w$.#/'"-])(?:parent|top)\.[A-Za-z_$]/

const LOCAL_STORAGE_REFERENCE_REGEX = /\blocalStorage\b/

export function parseCheckerRegex(regexText: string): RegExp {
  if (!regexText.startsWith('/')) return new RegExp(regexText)

  const closingSlashIndex = findRegexLiteralClosingSlashIndex(regexText)
  if (closingSlashIndex === 1) {
    throw new Error(`Invalid regex literal "${regexText}": it is empty`)
  }
  return new RegExp(
    regexText.slice(1, closingSlashIndex),
    regexText.slice(closingSlashIndex + 1).trimEnd(),
  )
}

function findRegexLiteralClosingSlashIndex(regexLiteralText: string): number {
  let isInsideCharacterClass = false
  let isEscaped = false
  for (let index = 1; index < regexLiteralText.length; index++) {
    const character = regexLiteralText[index]
    if (REGEX_LITERAL_LINE_BREAKS.includes(character)) {
      throw new Error(
        `Invalid regex literal "${regexLiteralText}": it contains a line break`,
      )
    }
    if (isEscaped) {
      isEscaped = false
    } else if (character === '\\') {
      isEscaped = true
    } else if (character === '[') {
      isInsideCharacterClass = true
    } else if (character === ']') {
      isInsideCharacterClass = false
    } else if (character === '/' && !isInsideCharacterClass) {
      return index
    }
  }
  throw new Error(
    `Invalid regex literal "${regexLiteralText}": it has no closing slash`,
  )
}

export function doesCodePassRegexChecker(
  code: string,
  regexText: string,
): boolean {
  let checkerRegex: RegExp
  try {
    checkerRegex = parseCheckerRegex(regexText)
  } catch {
    return false
  }
  return (
    checkerRegex.test(code) ||
    checkerRegex.test(code.replaceAll('\n', ' ')) ||
    !!code.match(checkerRegex) ||
    code.replace(/\s/g, '') === regexText.replace(/\s/g, '')
  )
}

export function checkSlide(slideDraft: SlideDraft): SlideCheckResult {
  const problems: string[] = []

  if (!slideDraft.title.trim()) problems.push('The slide has no title.')
  if (!slideDraft.body.trim()) problems.push('The slide has no body.')

  const compilingRegexCheckers: SlideDraft['checkers'] = []
  for (const checker of slideDraft.checkers) {
    if (
      CHECKER_TYPES_THE_CODE_PANEL_DOES_NOT_EVALUATE.includes(
        checker.type ?? '',
      )
    ) {
      continue
    }
    try {
      parseCheckerRegex(checker.regex)
      compilingRegexCheckers.push(checker)
    } catch (error) {
      problems.push(
        `The checker "${checker.name}" doesn't compile. ${(error as Error).message}`,
      )
    }
  }

  for (const checker of compilingRegexCheckers) {
    if (!doesCodePassRegexChecker(slideDraft.solutionCode, checker.regex)) {
      problems.push(`The solution doesn't pass the checker "${checker.name}".`)
    }
  }

  const starterCode = combineFilesLikeCodePanel(slideDraft.starterFiles)
  const starterCodePassesEveryRegexChecker =
    starterCode !== '' &&
    compilingRegexCheckers.length > 0 &&
    compilingRegexCheckers.every((checker) =>
      doesCodePassRegexChecker(starterCode, checker.regex),
    )
  if (starterCodePassesEveryRegexChecker) {
    problems.push(
      'The starter code already passes every checker, so the student has nothing to do.',
    )
  }

  for (const starterFile of slideDraft.starterFiles) {
    problems.push(
      ...findUnsafeCodeProblems(
        `The starter file "${starterFile.name}.${starterFile.extension}"`,
        starterFile.code,
      ),
    )
  }
  problems.push(
    ...findUnsafeCodeProblems('The solution', slideDraft.solutionCode),
  )

  return { passed: problems.length === 0, problems }
}

function combineFilesLikeCodePanel(files: SlideDraft['starterFiles']): string {
  return files
    .filter((file) => file.extension && file.extension.toLowerCase() !== 'test')
    .map((file) => file.code || '')
    .join('\n')
}

function findUnsafeCodeProblems(
  codeDescription: string,
  code: string,
): string[] {
  const unsafeCodeProblems: string[] = []
  if (EXTERNAL_SCRIPT_TAG_REGEX.test(code)) {
    unsafeCodeProblems.push(
      `${codeDescription} loads a script from an outside URL.`,
    )
  }
  if (PARENT_OR_TOP_WINDOW_REFERENCE_REGEX.test(code)) {
    unsafeCodeProblems.push(`${codeDescription} references parent or top.`)
  }
  if (LOCAL_STORAGE_REFERENCE_REGEX.test(code)) {
    unsafeCodeProblems.push(`${codeDescription} uses localStorage.`)
  }
  return unsafeCodeProblems
}

export function checkLessonReadyToFinish(
  slideCheckResults: SlideCheckResult[],
  slideCountRange: LessonSlideCountRange,
): LessonFinishCheckResult {
  const problems: string[] = []
  const slideCount = slideCheckResults.length

  if (slideCount < slideCountRange.min || slideCount > slideCountRange.max) {
    problems.push(
      `The lesson needs ${slideCountRange.min} to ${slideCountRange.max} slides, but it has ${slideCount}.`,
    )
  }
  slideCheckResults.forEach((slideCheckResult, slideIndex) => {
    if (!slideCheckResult.passed) {
      problems.push(
        `Slide ${slideIndex + 1} doesn't pass its checks: ${slideCheckResult.problems.join(' ')}`,
      )
    }
  })

  return { passed: problems.length === 0, problems }
}
