import {
  checkLessonReadyToFinish,
  checkSlide,
  doesCodePassRegexChecker,
  parseCheckerRegex,
  SlideCheckResult,
  SlideDraft,
} from './slide-checks'

const solutionWithHeading = '<body>\n  <h1>Hello</h1>\n</body>\n'

const starterAlreadyPassesProblem =
  'The starter code already passes every checker, so the student has nothing to do.'

function buildSlideDraft(overrides: Partial<SlideDraft> = {}): SlideDraft {
  return {
    title: 'Your first heading',
    body: '<p>Add an h1 that says Hello.</p>',
    starterFiles: [
      { name: 'index', extension: 'html', code: '<body>\n</body>' },
    ],
    solutionCode: solutionWithHeading,
    checkers: [{ name: 'Has an h1', regex: '/<h1>\\s*hello\\s*<\\/h1>/i' }],
    ...overrides,
  }
}

describe('parseCheckerRegex', () => {
  it('parses a /pattern/flags literal', () => {
    const checkerRegex = parseCheckerRegex('/<h1>hello<\\/h1>/gi')

    expect(checkerRegex.source).toBe('<h1>hello<\\/h1>')
    expect(checkerRegex.flags).toBe('gi')
    expect(checkerRegex.test('<H1>Hello</H1>')).toBe(true)
  })

  it('keeps slashes that are escaped or inside a character class', () => {
    const checkerRegex = parseCheckerRegex('/a[/]b\\/c/m')

    expect(checkerRegex.source).toBe('a[/]b\\/c')
    expect(checkerRegex.flags).toBe('m')
    expect(checkerRegex.test('a/b/c')).toBe(true)
  })

  it('ignores whitespace after the flags, like the code panel', () => {
    expect(parseCheckerRegex('/abc/i \n').flags).toBe('i')
  })

  it('passes text that does not start with a slash to new RegExp', () => {
    const checkerRegex = parseCheckerRegex('color:\\s*red')

    expect(checkerRegex.flags).toBe('')
    expect(checkerRegex.test('color: red')).toBe(true)
    expect(checkerRegex.test('COLOR: red')).toBe(false)
  })

  it.each([
    ['an unclosed group', 'a(b'],
    ['an unclosed group in a literal', '/a(b/'],
    ['a literal with no closing slash', '/abc'],
    ['a literal whose last slash is escaped', '/abc\\/'],
    ['an empty literal', '//'],
    ['unknown flags', '/abc/x'],
    ['a line break inside a literal', '/a\nb/'],
  ])('throws a clear error for %s', (_description, regexText) => {
    expect(() => parseCheckerRegex(regexText)).toThrow(
      /^Invalid (regular expression|regex literal|flags)/,
    )
  })
})

describe('doesCodePassRegexChecker', () => {
  it('passes when the regex matches the code', () => {
    expect(doesCodePassRegexChecker('<H1>Hi</H1>', '/<h1>/i')).toBe(true)
    expect(doesCodePassRegexChecker('<h2>Hi</h2>', '/<h1>/i')).toBe(false)
  })

  it('also tests the code with newlines replaced by spaces', () => {
    const codeOnThreeLines = '<p>\nHi\n</p>'

    expect(/<p>.*<\/p>/.test(codeOnThreeLines)).toBe(false)
    expect(doesCodePassRegexChecker(codeOnThreeLines, '/<p>.*<\\/p>/')).toBe(
      true,
    )
  })

  it('passes when the code equals the checker text without whitespace', () => {
    expect(new RegExp('let total=(a+b)').test('let total = (a + b)')).toBe(
      false,
    )
    expect(
      doesCodePassRegexChecker('let total = (a + b)', 'let total=(a+b)'),
    ).toBe(true)
  })

  it('never passes an invalid regex, even when the text equals the code', () => {
    expect(doesCodePassRegexChecker('a(b', 'a(b')).toBe(false)
  })
})

describe('checkSlide', () => {
  it('passes a complete slide', () => {
    expect(checkSlide(buildSlideDraft())).toEqual({
      passed: true,
      problems: [],
    })
  })

  it('needs a title and a body', () => {
    expect(checkSlide(buildSlideDraft({ title: '  ', body: '' }))).toEqual({
      passed: false,
      problems: ['The slide has no title.', 'The slide has no body.'],
    })
  })

  it('reports a regex checker that does not compile', () => {
    const result = checkSlide(
      buildSlideDraft({
        checkers: [
          { name: 'Has an h1', regex: '/<h1>/i' },
          { name: 'Broken', regex: '<h1(' },
        ],
      }),
    )

    expect(result.passed).toBe(false)
    expect(result.problems).toEqual([
      expect.stringMatching(/^The checker "Broken" doesn't compile\. Invalid/),
    ])
  })

  it('fails when the solution does not pass a regex checker', () => {
    expect(
      checkSlide(
        buildSlideDraft({ solutionCode: '<body>\n  <h2>Hello</h2>\n</body>' }),
      ),
    ).toEqual({
      passed: false,
      problems: ['The solution doesn\'t pass the checker "Has an h1".'],
    })
  })

  it('fails when the starter code already passes every regex checker', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          starterFiles: [
            { name: 'index', extension: 'html', code: '<h1>Hello</h1>' },
          ],
        }),
      ),
    ).toEqual({ passed: false, problems: [starterAlreadyPassesProblem] })
  })

  it('passes when the starter code fails at least one regex checker', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          starterFiles: [
            { name: 'index', extension: 'html', code: '<title>Page</title>' },
          ],
          solutionCode: `<title>Page</title>\n${solutionWithHeading}`,
          checkers: [
            { name: 'Has a title', regex: '<title>' },
            { name: 'Has an h1', regex: '/<h1>\\s*hello\\s*<\\/h1>/i' },
          ],
        }),
      ),
    ).toEqual({ passed: true, problems: [] })
  })

  it('joins the starter files with newlines, like the code panel', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          starterFiles: [
            { name: 'index', extension: 'html', code: '<h1>Hello' },
            { name: 'closing', extension: 'html', code: '</h1>' },
          ],
          solutionCode: '<h1>Hello\n</h1>',
          checkers: [
            { name: 'Two-line heading', regex: '/<h1>hello\\s+<\\/h1>/i' },
          ],
        }),
      ),
    ).toEqual({ passed: false, problems: [starterAlreadyPassesProblem] })
  })

  it('leaves out test files and files with no extension, like the code panel', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          starterFiles: [
            { name: 'index', extension: 'html', code: '<body>\n</body>' },
            { name: 'checks', extension: 'TEST', code: '<h1>Hello</h1>' },
            { name: 'notes', extension: '', code: '<h1>Hello</h1>' },
          ],
        }),
      ),
    ).toEqual({ passed: true, problems: [] })
  })

  it('treats empty starter code as failing, since the code panel does not check empty code', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          starterFiles: [],
          checkers: [{ name: 'Anything', regex: '.*' }],
        }),
      ),
    ).toEqual({ passed: true, problems: [] })
  })

  it('skips output, execute and manual checkers, which the code panel does not evaluate', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          checkers: [
            {
              name: 'Has an h1',
              regex: '/<h1>\\s*hello\\s*<\\/h1>/i',
              type: 'regex',
            },
            { name: 'Prints a greeting', regex: 'Hello(', type: 'output' },
            {
              name: 'Runs without errors',
              regex: 'return errors.length === 0',
              type: 'execute',
            },
            {
              name: 'Teacher review',
              regex: 'teacher approves',
              type: 'manual',
            },
          ],
        }),
      ),
    ).toEqual({ passed: true, problems: [] })
  })

  it('treats checkers with no type or an unknown type as regex, like the code panel', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          checkers: [
            {
              name: 'Has an h1',
              regex: '/<h1>\\s*hello\\s*<\\/h1>/i',
              type: null,
            },
            { name: 'Has a footer', regex: '<footer>', type: 'something-new' },
          ],
        }),
      ),
    ).toEqual({
      passed: false,
      problems: ['The solution doesn\'t pass the checker "Has a footer".'],
    })
  })

  it.each([
    [
      '<script src="https://cdn.example.com/confetti.js"></script>',
      'The solution loads a script from an outside URL.',
    ],
    [
      "<script type='module' src='http://example.com/app.js'></script>",
      'The solution loads a script from an outside URL.',
    ],
    [
      '<script async src=//cdn.example.com/app.js></script>',
      'The solution loads a script from an outside URL.',
    ],
    [
      '<script>parent.postMessage("done", "*")</script>',
      'The solution references parent or top.',
    ],
    [
      '<script>window.top.location.href = "/"</script>',
      'The solution references parent or top.',
    ],
    [
      '<script>localStorage.setItem("score", "1")</script>',
      'The solution uses localStorage.',
    ],
  ])('flags %s', (unsafeCode, expectedProblem) => {
    expect(
      checkSlide(
        buildSlideDraft({ solutionCode: solutionWithHeading + unsafeCode }),
      ),
    ).toEqual({ passed: false, problems: [expectedProblem] })
  })

  it('flags unsafe starter files by name', () => {
    expect(
      checkSlide(
        buildSlideDraft({
          starterFiles: [
            { name: 'index', extension: 'html', code: '<body>\n</body>' },
            { name: 'script', extension: 'js', code: 'localStorage.clear()' },
          ],
        }),
      ),
    ).toEqual({
      passed: false,
      problems: ['The starter file "script.js" uses localStorage.'],
    })
  })

  it.each([
    '<script src="./app.js"></script>',
    '<script src="/static/app.js"></script>',
    '<p>Scroll back to the top.</p>',
    '<style>.top.banner { color: red; }</style>',
    '<img src="images/top.png" alt="Top">',
    '<script>node.parent.children.push(child)</script>',
  ])('does not flag %s', (safeCode) => {
    expect(
      checkSlide(
        buildSlideDraft({ solutionCode: solutionWithHeading + safeCode }),
      ),
    ).toEqual({ passed: true, problems: [] })
  })
})

describe('checkLessonReadyToFinish', () => {
  const passedSlideCheckResult: SlideCheckResult = {
    passed: true,
    problems: [],
  }
  const slideCountRange = { min: 2, max: 3 }

  it('passes when the slide count is in range and every slide passed', () => {
    expect(
      checkLessonReadyToFinish(
        [passedSlideCheckResult, passedSlideCheckResult],
        slideCountRange,
      ),
    ).toEqual({ passed: true, problems: [] })
    expect(
      checkLessonReadyToFinish(
        [
          passedSlideCheckResult,
          passedSlideCheckResult,
          passedSlideCheckResult,
        ],
        slideCountRange,
      ),
    ).toEqual({ passed: true, problems: [] })
  })

  it.each([
    [1, 'The lesson needs 2 to 3 slides, but it has 1.'],
    [4, 'The lesson needs 2 to 3 slides, but it has 4.'],
  ])('fails with %i slides', (slideCount, expectedProblem) => {
    const slideCheckResults = Array.from(
      { length: slideCount },
      () => passedSlideCheckResult,
    )

    expect(
      checkLessonReadyToFinish(slideCheckResults, slideCountRange),
    ).toEqual({ passed: false, problems: [expectedProblem] })
  })

  it('fails when a slide failed its checks, naming the slide', () => {
    const failedSlideCheckResult: SlideCheckResult = {
      passed: false,
      problems: ['The slide has no title.', 'The slide has no body.'],
    }

    expect(
      checkLessonReadyToFinish(
        [passedSlideCheckResult, failedSlideCheckResult],
        slideCountRange,
      ),
    ).toEqual({
      passed: false,
      problems: [
        "Slide 2 doesn't pass its checks: The slide has no title. The slide has no body.",
      ],
    })
  })
})
