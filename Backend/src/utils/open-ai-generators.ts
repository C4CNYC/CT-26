import OpenAI from 'openai'

/* eslint-disable no-useless-escape */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const theoryAndExcercize = `Create a coding lesson that teaches the concept expressed in the prompt in a fun and engaging way. If necessary, provide an analogy to make it make-sense.

#Introduction
To start the lesson you will provide a fun snapshot explaining what the student will learn and what they will be able to do at the end of the lesson.

#Preparatory or Encouragement slides

- Preparatory Slides:
Often, before a complex “Briefing” or “Challenge” slide you will intersperse a “Preparatory” slide in which you will mentally prepare the student “This next one is gonna be a bit complicated, but I’m sure you can get it. - And I’ll give you a hint if you need it.”

- Encouragement Slides:
Similarly, intersperse the “Challenge” slides with “Encouragement” slides in which you celebrate completing a previous challenge with a large, over-sized, center-aligned emoji/s and one or two congratulator words like “AMAZING” or “That’s OUTSTANDING!” at the top of the page.

#Concept in Briefing Slides:
You will teach the main concept via 2-4 fun and engaging html “Briefing” slides.

The each slide presents the concept and builds on the previous one.
Often the first “Briefing” slide provides a fun explanation of the concept in a single sentence with a short emoji sequence afterward, to make it come to life.

#Challenge Slides:
After that there will be 3-4 exercises. Each exercise will be on it’s own slide. We call any slides that require the student to take action a “Challenge” slide.

At the top of the slide it says “Challenge” in all caps.

Each exercise slides will have it’s own starter code returned as preload_body and solution code returned as solution_body .
There will also be a hint per exercise.

#Starter Code:
The starter code can be anything between 1 line and 50 lines. Longer exercises allow the student to add code into mini apps that have a utility - see the result showing in a real-mini application.
Usually, the longest example, which can be defined as the “Real-world Example” can be the last exercise of the lesson.

#Ending Slides:
End the lesson with a very upbeat and congratulatory tone.
- Summarize what was learnt and covered.
- Congratulate the learner on completing it while encouraging more learning and what could be learnt next and what it could enable.
- Lastly, end the lesson with a MASSIVE high-five emoji or graphic and a large all caps “Congratulations” at the top.
At the bottom something like: You’ve completed this lesson.

#Lesson Styling:
If there is a need for a style sheet for the lesson, you will add that as “lesson-stylesheet”. It will be integrated into the lesson and reflected in the frontend on the slides.

Usually,
- the bg of the Preparatory or Encouragement slides is black or dark grey.
- The bg of Challenge slides is a rich golden yellow (should not be too bright )
- Briefing slides can have a dark navy bg and a tiny title with the concept name written at the upper left.
- The first lesson snapshot slide has a salmon bg color.

#Fun:
Pepper many emojis and fun words throughout the lesson.`

export async function generateFullLesson({
  lessonPrompt,
  lessonDuration,
  proficiencyLevel,
  lessonType,
  programmingLanguage,
  track,
  persona,
  grade,
  language,
  tone,
}: {
  lessonPrompt: string
  lessonDuration: string
  proficiencyLevel: string
  lessonType: string
  programmingLanguage: string
  track: string
  persona: string
  grade: string
  language: string
  tone: string
}) {
  try {
    const prompt = `Create a coding lesson based on the following prompt and parameters:
    Lesson Prompt: ${lessonPrompt}
    Lesson Duration: ${lessonDuration}
    Proficiency Level: ${proficiencyLevel}
    Lesson Type: ${lessonType}
    Programming Language: ${programmingLanguage}
    Track: ${track}
    Persona: ${persona}
    Grade: ${grade}
    Write the lesson in Language: ${language}
    Tone: ${tone}

    output format = {
    lesson: {
      title: string
      description: string
    },
    slides: [{
      body: Json string of {content: small work for student to solve } // description what will student do 
      tips: string            // for mini help
      solution_body: string   // solution code  
      title: string           // part title
      active: boolean;
      bg_color: string;
      complexity: string;     // beginer etc
      preload_body: string;   // the code to display in the code editor when the student starts the slide
      slug: string;
      tags: string[];
      type: string;           // the type of slide. Always make this "slides"
      meta:{order:number};    // order of parts
  }]}
  example = {
    lesson: {
      title: "Welcome to the coding world!",
      description: "This lesson will help you learn the basics of coding.",
    },
    slides: [{
          body:"{\"content\":\"<div><h2>CHALLENGE</h2><p class=\\\"fs75 black\\\">STEP 1 OF 2</p></div><div class=\\\"my-auto\\\"><p class=\\\"h1 black text-left desktop-only sfirstslide\\\">Hi,... </p><p class=\\\"h1 black text-left mobile-only\\\">Hi,... <img class=\\\"swiper-lazy\\\" src=\\\"/img/emoji/72/waving-hand-sign-type-3.png\\\" alt=\\\"\\\"></p><div class=\\\"h2 black text-left desktop-only sfirstslide\\\"><p>Type <span class=\\\"inline-code bg-black p-2\\\">&lt;h1&gt;</span> in the code editor on the right.</p></div><div class=\\\"h2 black text-left mobile-only\\\"><p>Type <span class=\\\"inline-code bg-black p-2\\\">&lt;h1&gt;</span> in the code editor.</p></div></div>\"}",
          tips:"There are no spaces between all the characters.",
          solution_body:"<span class="green-solution">&lt;h1&gt;</span>",
          title: "first step"
          description: "intro to editor",
          active: true;
          complexity: "beginner";    
          preload_body: "";
          slug: string;
          tags: "";
          type: "slides";          
          meta:{order:1};
    }]}
  our editor has 3 parts: 
  * body : explanations,
  * codeeditor: student enters
  * viewer: students sees results
  
  return only json output without preamble. Make sure the result is properly formatted as JSON, even if the generation cuts off. Do not use any single quotation marks ('). Return 7 or fewer slides.

    ${theoryAndExcercize}
    Please provide a structured lesson with clear explanations and code examples in rich text format (HTML). Make sure the solution will work if saved as an HTML file. The lesson should be tailored to the specified duration, proficiency level, and track. Use the selected persona's style as the narrator to present the information. Incorporate the user's lesson prompt into the lesson content.`

    console.info(
      `Generating lesson content with prompt: ${prompt.slice(0, 100)}...`,
    )

    // const response = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: prompt }],
    //   max_tokens: 1500,
    //   response_format: { type: "json_object" },
    // })

    console.info(
      `Successfully generated lesson content for prompt: ${lessonPrompt}`,
    )
    // console.log(response)
    return await openAiRequest(prompt)
    // return response.choices[0].message.content
  } catch (error: unknown) {
    console.error(
      `Error generating lesson content: ${(error as Error).message}`,
      { error },
    )
    throw new Error((error as Error).message)
  }
}

export async function generateLesson({
  lessonPrompt,
  lessonDuration,
  proficiencyLevel,
  lessonType,
  programmingLanguage,
  track,
  persona,
  grade,
  language,
  tone,
}: {
  lessonPrompt: string
  lessonDuration: string
  proficiencyLevel: string
  lessonType: string
  programmingLanguage: string
  track: string
  persona: string
  grade: string
  language: string
  tone: string
}) {
  try {
    const prompt = `Create a coding lesson based on the following prompt and parameters:
      Lesson Prompt: ${lessonPrompt}
      Lesson Duration: ${lessonDuration}
      Proficiency Level: ${proficiencyLevel}
      Lesson Type: ${lessonType}
      Programming Language: ${programmingLanguage}
      Track: ${track}
      Persona: ${persona}
      Grade: ${grade}
      Write the lesson in Language: ${language}
      Tone: ${tone}
    

      Please provide a structured lesson with clear explanations and code examples in rich text format (HTML). Include some style colors and emoji characters to make it fun. Make sure the solution will work if saved as an HTML file. The lesson should be tailored to the specified duration, proficiency level, and track. Use the selected persona's style as the narrator to present the information. Return only one slide. Return the lesson content as a string under the body property`

    console.info(
      `Generating lesson content with prompt: ${prompt.slice(0, 100)}...`,
    )

    // const response = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: prompt }],
    //   max_tokens: 1500,
    // })

    console.info(
      `Successfully generated lesson content for prompt: ${lessonPrompt}`,
    )
    // console.log(response)
    // return response.choices[0].message.content
    return await openAiRequest(prompt)
  } catch (error: unknown) {
    console.error(
      `Error generating lesson content: ${(error as Error).message}`,
      { error },
    )
    throw new Error((error as Error).message)
  }
}

export async function generateSupportingElements(
  lessonContent: string,
  language: string,
): Promise<any> {
  try {
    const prompt = `Based on the following lesson content, generate supporting elements in language ${language} such as:
1. Pre-loaded code: This should be a starting point for the lesson, not the full solution. It may include necessary imports or a basic structure for the student to build upon. If no pre-loaded code is necessary, leave this field empty. Make this field work as HTML.
2. Hint: A helpful tip or suggestion to guide the student if they get stuck, without giving away the full solution.
3. Solution code: The complete code that solves the problem or completes the task presented in the lesson. If the lesson doesn't require a specific code solution, leave this field empty. Solution code should work as HTML.
4. Image Prompt: A description of an image that would visually support or illustrate a key concept from the lesson.
5. Description: A short description of the lesson.
6. Title: A title for the lesson.

Lesson content:
${lessonContent.slice(0, 500)}...

Please provide these supporting elements in a JSON format, ensuring that each element is distinct and serves its specific purpose as described above. Do not fill any field with the lesson content if it's not appropriate.`

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates supporting elements for coding lessons.',
        },
        { role: 'user', content: prompt },
      ],
      functions: [
        {
          name: 'generate_supporting_elements',
          description: 'Generate supporting elements for a coding lesson',
          parameters: {
            type: 'object',
            properties: {
              preloaded_code: {
                type: 'string',
                description:
                  'Starting code for the lesson, not the full solution',
              },
              hint: {
                type: 'string',
                description:
                  'A helpful tip without giving away the full solution',
              },
              solution_code: {
                type: 'string',
                description: 'The complete code that solves the problem',
              },
              image_prompt: {
                type: 'string',
                description:
                  'A description of an image that illustrates a key concept',
              },
              description: {
                type: 'string',
                description: 'A description of the lesson',
              },
              title: {
                type: 'string',
                description: 'A title for the lesson',
              },
            },
            required: [
              'preloaded_code',
              'hint',
              'solution_code',
              'image_prompt',
              'description',
              'title',
            ],
          },
        },
      ],
      function_call: { name: 'generate_supporting_elements' },
    })

    if (response.choices[0]?.message?.function_call) {
      const functionCall = response.choices[0].message.function_call
      try {
        const supportingElems = JSON.parse(functionCall.arguments)
        // eslint-disable-next-line prettier/prettier
        const checkKeys = ['preloaded_code', 'solution_code']
        checkKeys.forEach((key: string) => {
          if (
            supportingElems[key] &&
            lessonContent.includes(supportingElems[key])
          ) {
            supportingElems[key] = ''
          }
        })
        return supportingElems
      } catch (error) {
        console.error('Error parsing function call arguments', error)
        return error
      }
    } else if (response.choices[0].message.tool_calls) {
      // TODO: use tool_calls (new API format)
    }
  } catch (error) {
    console.error(
      `Error generating supporting elements: ${JSON.stringify(error)}`,
    )
    throw new Error(JSON.stringify(error))
  }
}
export async function openAiRequest(
  message: string,
  add_response_format: boolean = true,
) {
  const params: { response_format?: any; model?: string } = {}
  if (add_response_format) {
    params.response_format = { type: 'json_object' }
    params.model = 'gpt-4o-2024-08-06'
    message = `${message} (return your response as json)`
  } else {
    params.response_format = { type: 'text' }
    params.model = 'gpt-3.5-turbo-16k'
  }
  const body = {
    ...params,
    messages: [{ role: 'user', content: `${message}` }],
  }
  const response: any = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  ).then((r) => r.json())
  return response?.choices?.[0]?.message.content
}

export async function askAIHelp(message: string) {
  const response: any = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'user',
            content: `${message} (return your response as json with the format: { data: "This is the AI response" })`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    },
  ).then((r) => r.json())
  return response.choices[0].message.content
}
