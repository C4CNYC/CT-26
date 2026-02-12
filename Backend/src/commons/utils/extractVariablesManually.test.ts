import { seperateTemplateForAiQuery } from './strip-quotes-from-ai-response'

function runTests() {
  const tests = [
    {
      description: 'ai tags',
      input: `a 
      // ai start
      simpleVariable kedi kopek
      
      //ai end
       curly braces`,
      expected: 'simpleVariable kedi kopek',
      params: '99999999',
      expected2: `a 
      99999999
       curly braces`,
    },
    {
      description: 'equals',
      input: `hadi bunu da yap
      ====
      buradaki bisey
      ====
      curly braces`,
      expected: 'buradaki bisey',
      params: '99999999',
      expected2: `hadi bunu da yap
      99999999
      curly braces`,
    },
    {
      description: 'a single variable with curly braces',
      input: '{{ simpleVariable }}',
      expected: [' simpleVariable '],
      params: '["99999999"]',
      expected2: '99999999',
    },
    {
      description: 'multiple variables',
      input: '{{ var1 }} and {{ var2 }}',
      expected: [' var1 ', ' var2 '],
      params: '["99999999","88888888"]',
      expected2: '99999999 and 88888888',
    },
    {
      description: 'variables with nested curly braces',
      input: '{{ simpleVariable }} and {{vari{{xxx}} kedi}}',
      expected: [' simpleVariable ', 'vari{{xxx}} kedi'],
      params: '["99999999","88888888"]',
      expected2: '99999999 and 88888888',
    },
    {
      description: 'an empty array if no variables are present',
      input: 'No variables here',
      expected: 'No variables here',
      params: '99999999',
      expected2: '99999999',
    },
    {
      description: 'strings with no closing curly braces',
      input: '{{ variable ',
      expected: '{{ variable',
      params: '99999999',
      expected2: '99999999',
    },
  ]

  tests.forEach(({ description, input, expected, params, expected2 }) => {
    const result = seperateTemplateForAiQuery(input)
    let passed =
      result.variables === JSON.stringify(expected) ||
      result.variables === expected
    console.log(
      `${passed ? '\x1b[32mPassed' : '\x1b[31mFailed'}   : ${description} `,
    )
    if (!passed) {
      console.log(`  Input: "${input}"`)
      console.log(`  Expected: "${JSON.stringify(expected)}"`)
      console.log(result.variables)
      console.log(result)
    }
    const result2 = result.responseToSlide(params)
    passed = result2 === expected2
    console.log(`${passed ? '\x1b[32mPassed\x1b[0m' : '\x1b[31mFailed'}  `)
    if (!passed) {
      console.log(`  Input: "${input}"`)
      console.log(`  Expected: "${expected2}"`)
      console.log(`  Result2:  "${result2}\x1b[0m "`)
    }
  })
}

runTests()
