/* eslint-disable @typescript-eslint/no-unsafe-return */
/**  stripts \`\`\`json  javascript  python  from the begining and at the end \`\`\` of  string
 */
export function stripQuotesFromAiResponse1(response: string): string {
  if (!response.startsWith('```')) return response
  return response.replace(/^```(\w)*/, '').replace(/```$/, '')
}
export function stripQuotesFromAiResponse(response: string): string {
  const match = response.match(/```[\w-]*\n?([\s\S]*?)```/)
  return match ? match[1].trim() : response
}
/**
 * Extracts clean JSON from an AI response that may contain explanatory text and code blocks
 * @param {string} response - The raw AI response text
 * @returns {object|null} - Parsed JSON object or null if no valid JSON found
 */
export function JsonParseFromAiResponse(response: string) {
  // First try: Check if the entire response is valid JSON
  try {
    const trimmedResponse = response.trim()
    return JSON.parse(trimmedResponse)
  } catch (error) {
    // Not pure JSON, continue to next method
  }

  // Second try: Look for content between ```json (optional) and ``` markdown code block markers
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/
  const match = response.match(jsonRegex)

  if (match && match[1]) {
    try {
      // Attempt to parse the extracted string as JSON
      const jsonStr = match[1].trim()
      return JSON.parse(jsonStr)
    } catch (error) {
      // If parsing fails, try the next code block if available
      const remainingText = response.substring(
        response.indexOf(match[0]) + match[0].length,
      )
      if (remainingText.includes('```')) {
        return stripQuotesFromAiResponse(remainingText)
      }
    }
  }

  // Third try: Look for what might be JSON content without code block markers
  // This is a best-effort approach and may produce false positives
  try {
    // Look for text that starts with { and ends with }
    const possibleJsonRegex = /(\{[\s\S]*\})/
    const possibleMatch = response.match(possibleJsonRegex)

    if (possibleMatch && possibleMatch[1]) {
      return JSON.parse(possibleMatch[1].trim())
    }
  } catch (error) {
    // If all attempts fail, return null
    console.error('Could not find valid JSON in the response')
    return null
  }

  return null
}

export function JsonParseFromAiResponse2(response: string): any {
  try {
    return JSON.parse(stripQuotesFromAiResponse(response))
  } catch (error) {
    console.log('Error in parsing JSON', error, response)
    return response
  }
}
/* json.parse kills application, this function instead returns default value */
function jsonSafeParse(valueToBeParsed: string, defaultValue: any) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(valueToBeParsed)
  } catch (error) {
    console.warn('JSON parsing failed:', error)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return defaultValue
  }
}

// Example usage
// const result = extractVariablesManually("{{ simpleVariable }} and {{vari{{xxx}} kedi}}");
// console.log(result); // Output: [" simpleVariable ", "vari{{xxx}} kedi"]
function extractVariablesManually(input: string): string[] {
  const variables: string[] = []
  let depth = 0
  let currentVariable = ''
  let insideVariable = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const nextChar = input[i + 1]

    if (char === '{' && nextChar === '{') {
      if (insideVariable) {
        // Nested opening braces
        currentVariable += '{{'
      }
      insideVariable = true
      depth += 1
      i++ // Skip the next character since we've processed '{{'
    } else if (char === '}' && nextChar === '}' && insideVariable) {
      depth -= 1
      if (depth === 0) {
        variables.push(currentVariable)
        currentVariable = ''
        insideVariable = false
      } else {
        // Nested closing braces
        currentVariable += '}}'
      }
      i++ // Skip the next character since we've processed '}}'
    } else if (insideVariable) {
      currentVariable += char
    }
  }

  return variables
}

type SeperateTemplateForAiQueryReturn = {
  variables: string
  responseToSlide: (variables: string) => string
  type: 'none' | 'ai' | 'equal' | 'variable'
}

/** given a template string, return a function and variable(s) . Variables should feed to ai, and response should be given function to return final string(slide)
 *
 * @param template : string 4 types,
 *  ie1:"123 //ai start var  //ai end 789"   responsetoSlide('cat') returns "123 cat 789"
 *  ie2:"123 ==== var  ==== 789"   responsetoSlide('cat') returns "123 cat 789"
 *  ie3:"123 {{var}} {{her}}  789"   responsetoSlide('["cat", "456"]') returns "123 cat 456 789"
 *  ie4:"123 45 6  789"   responsetoSlide('cat') returns "cat" // if no template everything replaces with input
 *
 *  @returns
 * {
 *    variables: string,
 *    responseToSlide: (aiResponse: string) => string
 *  }
 */
export function seperateTemplateForAiQuery(
  template: string,
): SeperateTemplateForAiQueryReturn {
  let returnvalue: SeperateTemplateForAiQueryReturn = {
    variables: template,
    responseToSlide: (variables) => variables,
    type: 'none',
  }
  // Check for "ai start" and "ai end"
  const aiBlockMatch = template.match(/ai start([\s\S]*?)ai end/)
  if (aiBlockMatch && aiBlockMatch.index !== undefined) {
    const index = aiBlockMatch.index
    returnvalue = {
      variables: aiBlockMatch[1].slice(0, -3).trim(),
      responseToSlide: (variables) =>
        template.substring(0, index - 3) +
        variables +
        template.substring(index + aiBlockMatch[0].length),
      type: 'ai',
    }
  } else {
    // Check for "====" markers
    const equalBlockMatch = template.match(/====([\s\S]*?)====/)
    if (equalBlockMatch && equalBlockMatch.index !== undefined) {
      const index = equalBlockMatch.index
      returnvalue = {
        variables: equalBlockMatch[1].trim(),
        responseToSlide: (variables) =>
          template.substring(0, index) +
          variables +
          template.substring(index + equalBlockMatch[0].length),
        type: 'equal',
      }
    } else {
      // Check for {{variable}} style
      const variableMatches = template.match(/{{[^}]+}}/g)
      if (variableMatches) {
        const extractedCode = extractVariablesManually(template)
        returnvalue = {
          variables: JSON.stringify(extractedCode),
          responseToSlide: (variables) => {
            const vars = jsonSafeParse(variables, []) as string[]
            if (vars.length !== extractedCode.length) {
              console.log('count of params dont match!!!', vars, extractedCode)
            }
            extractedCode.forEach((ecode, index) => {
              template = template.replace('{{' + ecode + '}}', vars[index])
            })
            return template
          },
          type: 'variable',
        }
      } else {
        // Fallback to all code
        returnvalue = {
          variables: JSON.stringify(template.trim()),
          responseToSlide: (variables) => variables,
          type: 'none',
        }
      }
    }
  }
  console.log('seperateTemplateForAiQuery : ', returnvalue.type)
  return returnvalue
}
