/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindOptionsRelations } from 'typeorm'

import { CreateLessonContentDto } from '@/api/manager/lesson-content-manager-api/dtos/create-content-lesson.dto'
import {
  JsonParseFromAiResponse,
  seperateTemplateForAiQuery,
  stripQuotesFromAiResponse,
} from '@/commons/utils/strip-quotes-from-ai-response'
import { LessonContentFileService } from '@/modules/core/lesson-content-file/lesson-content-file.service'
import { LessonContentComplexity } from '@/modules/core/lesson-content/enums/lesson-content-complexity.enums'
import { LessonContentType } from '@/modules/core/lesson-content/enums/lesson-content-type.enums'
import { LessonContent } from '@/modules/core/lesson-content/lesson-content.entity'
import { LessonType } from '@/modules/core/lesson/enums/lesson-type.enum'
import { SchoolService } from '@/modules/core/school/school.service'
import { UserService } from '@/modules/core/user/user.service'
import { OpenAIService } from '@/providers/openai/openai.service'
import {
  askAIHelp,
  generateFullLesson,
  generateLesson,
  generateSupportingElements,
  openAiRequest,
} from '@/utils/open-ai-generators'

import { CreateLessonDto } from '../../../api/manager/lesson-manager-api/dtos/create-lesson.dto'
import { LessonSearchOptions } from '../../../api/manager/lesson-manager-api/dtos/lesson-search-option.dto'
import { UpdateLessonDto } from '../../../api/manager/lesson-manager-api/dtos/update-lesson.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Environment } from '../../../api/manager/environments/entities/environment.entity'
import { Integration } from '../../core/integration/integration.entity'
import { Lesson } from '../../core/lesson/lesson.entity'
import { LessonService } from '../../core/lesson/lesson.service'
import { LessonToEnvironment } from '../../core/lesson-to-environment/lesson-to-environment.entity'
import { Skill } from '../../core/skills/skill.entity'
import { CourseUnitLessonsManagerService } from '../course-unit-lessons-manager/course-unit-lessons-manager.service'
import { LessonContentManagerService } from '../lesson-content-manager/lesson-content-manager.service'
import { LessonDeepAssignService } from '../lesson-deep-assign/lesson-deep-assign.service'
import { AIProvidersService } from '@/providers/aiproviders/aiproviders.service'

export type CreateLessonUsingOpenAIAssistantProps = {
  lesson_id: string
  newLessonId?: string
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
  NumberOfSlides: string
  slideNames: string
}
type GeneratorParametersAssistant = {
  provider: string,
  max_tokens: number,
  model: string,
  message: string
}

type GeneratorParameters = {
  SlideCreator: GeneratorParametersAssistant
  SlideCreatorAssistant: string
  LessonCreator: GeneratorParametersAssistant
  LessonCreatorAssistant: string
  NumberOfSlides: string
}
type LessonSchemaSlide = {
  starterCode?: string,
  solutionCode?: string,
}
type LessonSchema = {
  lessonname: string,
  description: string,
  starterCode?: string,
  solutionCode?: string,
  slides: LessonSchemaSlide[],


}

export type createLessonUsingN8nProps =
  CreateLessonUsingOpenAIAssistantProps & {
    newLessonId: string
  }

@Injectable()
export class LessonManagerService {
  constructor(
    private lessonService: LessonService,
    private schoolService: SchoolService,
    private lessonContentManagerService: LessonContentManagerService,
    private lessonDeepAssignService: LessonDeepAssignService,
    private lessonContentFileService: LessonContentFileService,
    private userService: UserService,
    private openAIService: OpenAIService,
    private aiprovidersService: AIProvidersService,
    private courseUnitLessonsManagerService: CourseUnitLessonsManagerService,
  ) { }

  async getList(
    userId: string | undefined,
    dto: LessonSearchOptions,
  ): Promise<PageDto<Lesson>> {
    return await this.lessonService.getList(dto)
  }

  async getOwnList(
    userId: string,
    dto: LessonSearchOptions,
  ): Promise<PageDto<Lesson>> {
    return await this.lessonService.getListByUserId(userId, dto)
  }

  async getLesson(
    id: string,
    relations?: FindOptionsRelations<Lesson>,
    studentId?: string,
  ): Promise<Lesson> {
    const lesson = await this.lessonService.findOne({
      where: { id },
      relations,
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")
    return lesson
  }

  async getLessonWithoutContent(
    id: string,
    relations?: FindOptionsRelations<Lesson>,
    studentId?: string,
  ): Promise<Lesson> {
    const lesson = await this.lessonService.findOne({
      where: { id },
      relations,
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")
    return lesson
  }

  async create(
    userId: string,
    dto: CreateLessonDto,
    school_id?: string,
  ): Promise<Lesson> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
    })

    const lesson = await this.lessonService.create({
      description: dto.description,
      head: dto.head,
      independent: dto.independent,
      name: dto.name,
      tips: dto.tips,
      type: dto.type,
      duration: dto.duration,
      active: dto.active,
      slug: dto.slug,
      userId: userId,
      meta: dto.meta ?? {},
    })

    await this.lessonService.update(lesson.id, { school: school })

    return lesson
  }

  async createByCloning(
    userId: string,
    lesson_id: string = '1e550800-0000-0000-0000-000000000000',
    school_id: string,
  ): Promise<Lesson | Error> {
    try {
      return await this.lessonDeepAssignService.CloneLessonToTeacher(
        {
          user_id: userId,
          lesson_id,
        },
        school_id,
      )
    } catch (e) {
      return await this.create(
        userId,
        {
          name: 'New Lesson',
          description: 'New Lesson',
          type: LessonType.PRACTICAL,
          duration: '60',
          active: true,
          head: '',
          independent: true,
          tips: [''],
          slug: (new Date().getTime() - 1729692100000).toString(36),
        },
        school_id,
      )
    }
  }
  getLessonBySlug(slug: string): Promise<Lesson> {
    //@todo - check for active and open lessons
    return this.lessonService.findOne({ where: { slug } })
  }
  async checkSlug(slug: string): Promise<boolean> {
    const lesson = await this.lessonService.findOne({ where: { slug } })
    return lesson ? true : false
  }

  async update(id: string, dto: UpdateLessonDto): Promise<void> {
    const lesson = await this.lessonService.getLesson(id)
    const challenges = lesson.contents.reduce(
      (sum, content) => sum + (content.validations.length ? 1 : 0),
      0,
    )

    if (!dto.meta) dto.meta = {}
    dto.meta.challenges = challenges

    if (!lesson) throw new NotFoundException("module doesn't exist")
    if (!dto.slug) {
      if (!lesson.slug) {
        dto.slug = lesson.slug
      } else {
        dto.slug = (new Date().getTime() - 1729692100000).toString(36)
      }
    }

    await this.lessonService.update(id, dto)

    if (
      lesson.units &&
      lesson.units.length > 0 &&
      lesson.duration != dto.duration
    )
      for (const courseUnit of lesson.units)
        this.courseUnitLessonsManagerService
          .calculateUnitDuration(courseUnit.id)
          .catch((e) => console.log(e))
  }

  async addIntegration(id: string, integration: Integration): Promise<void> {
    const content = await this.getLesson(id, { integrations: true })
    content.integrations.push(integration)
    await this.lessonService.repository.save(content)
  }

  async removeIntegration(id: string, integration_id: string): Promise<void> {
    const content = await this.getLesson(id, { integrations: true })
    content.integrations = content.integrations.filter(
      (integrations) => integrations.id !== integration_id,
    )
    await this.lessonService.repository.save(content)
  }

  async addSkill(id: string, skill: Skill): Promise<void> {
    const content = await this.getLesson(id, { skills: true })
    content.skills.push(skill)
    await this.lessonService.repository.save(content)
  }

  async removeSkill(id: string, skill_id: string): Promise<void> {
    const content = await this.getLesson(id, { skills: true })
    content.skills = content.skills.filter((skill) => skill.id !== skill_id)
    await this.lessonService.repository.save(content)
  }

  async remove(id: string): Promise<void> {
    const content = await this.getLesson(id, { skills: true })
    content.skills = []
    content.last_slides = []
    // Remove foreign key constraints (skills and last_slides) -- this is a workaround
    await this.lessonService.repository.save(content)
    await this.lessonService.remove(id)
  }

  async addEnvironment(id: string, environment: Environment): Promise<void> {
    const content = await this.getLesson(id, { environments: true })
    content.environments.push(environment)
    await this.lessonService.repository.save(content)
  }

  async removeEnvironment(id: string, environment_id: string): Promise<void> {
    const content = await this.getLesson(id, { environments: true })
    content.environments = content.environments.filter(
      (environment) => environment.id !== environment_id,
    )
    await this.lessonService.repository.save(content)
  }

  async updateEnvironmentOrder(id: string, environment_id: string, sort: number): Promise<void> {
    const lessonToEnvironment = await this.lessonService.repository.manager
      .getRepository(LessonToEnvironment)
      .findOne({
        where: {
          lessonId: id,
          environmentId: environment_id,
        },
      })

    if (!lessonToEnvironment) {
      throw new NotFoundException('Environment not found in lesson')
    }

    lessonToEnvironment.sort = sort
    await this.lessonService.repository.manager
      .getRepository(LessonToEnvironment)
      .save(lessonToEnvironment)
  }

  async getEnvironments(lesson_id: string): Promise<Environment[]> {
    const content = await this.getLesson(lesson_id, {
      environments: true,
    })
    return content.environments
  }

  async generateFull(data: any): Promise<{ lesson: any; slides: any }> {
    const lesson_content: any = await generateFullLesson({
      lessonPrompt: data.lessonPrompt,
      lessonDuration: data.lessonDuration,
      proficiencyLevel: data.level,
      lessonType: data.projectType,
      programmingLanguage: data.lessonLanguage,
      track: data.track,
      persona: data.persona,
      grade: data.grade,
      language: data.language,
      tone: data.tone,
    })
    const content_array = JSON.parse(lesson_content) as {
      lesson: any
      slides: any
    }

    console.log(
      `Successfully generated lesson for prompt: ${data.lessonPrompt}`,
    )

    return content_array
  }

  async generate(data: any): Promise<{ lesson: any; supportingElements: any }> {
    let lessonContent: any = await generateLesson({
      lessonPrompt: data.lessonPrompt,
      lessonDuration: data.lessonDuration,
      proficiencyLevel: data.level,
      lessonType: data.projectType,
      programmingLanguage: data.programmingLanguage,
      track: data.track,
      persona: data.persona,
      grade: data.grade,
      language: data.language,
      tone: data.tone,
    })

    try {
      lessonContent = JSON.parse(lessonContent).body
    } catch (err) {
      console.error('Error parsing lesson content', err)
    }
    console.log('Generating supporting elements')
    const supportingElements = await generateSupportingElements(
      lessonContent,
      data.language,
    )

    lessonContent = lessonContent
      .replace(
        '<body>',
        '<body><div style="height:calc( 100vh - 7rem ); overflow-y:auto;">',
      )
      .replace('</body>', '</div><body>')
    const fullResponse = {
      lesson: lessonContent,
      supportingElements: supportingElements,
    }
    console.log(
      `Successfully generated lesson for prompt: ${data.lessonPrompt}`,
      fullResponse,
    )
    return fullResponse
  }
  async n8nRequest(
    endPointPath: string,
    prompt: string | object,
  ): Promise<any> {
    const noBannedChars = endPointPath.replace(/\W/g, '')
    if (noBannedChars.length !== endPointPath.length) {
      throw new Error('Invalid endpoint path')
    }

    try {
      const res = await fetch(`${process.env.N8N_URL}${endPointPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + process.env.N8N_AUTH,
        },
        body: typeof prompt == 'string' ? prompt : JSON.stringify(prompt),
      })

      const response = await res.text()
      if (!res.ok) {
        console.error('Error in n8n request', response)
        throw new Error(`Error: ${res.statusText}`)
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(response)
      } catch (err) {
        console.log('Error parsing response', endPointPath, response)
        // Allow the error to propagate to other catchers
      }
    } catch (err) {
      console.error('n8nRequest failed:', endPointPath, err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      throw new Error(`n8nRequest failed: ${errorMessage}`)
    }
  }

  async openAiRequest(
    prompt: string,
    add_response_format: boolean,
  ): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await openAiRequest(prompt, add_response_format)
  }

  async recursivelyAddSlides(
    lesson_id: string,
    thread_id: string,
    assistant_id: string,
    slideTemplates: LessonContent[],
    slides: any[],
  ): Promise<any> {
    if (slides.length === 0) return
    const slide = slides.shift()
    const slideType = slide.type.toLocaleLowerCase().trim()

    let currentSlideTemplate = slideTemplates.find(
      (content) => content.title.toLocaleLowerCase() == slideType,
    )
    if (!currentSlideTemplate) {
      console.log('Slide template not found for', slideType)
      currentSlideTemplate = slideTemplates.find(
        (content) => content.title.toLocaleLowerCase() == 'default',
      )
    }

    let instructionContent = ''
    let template = ''
    let templateStartIndex = 0
    let templateEndIndex = 0

    if (currentSlideTemplate) {
      template = JSON.parse(
        currentSlideTemplate.body as unknown as string,
      ).content
      const startMatch = template.match(/ai start/i)
      const endMatch = template.match(/ai end/i)
      if (startMatch && endMatch && startMatch.index && endMatch.index) {
        templateStartIndex = startMatch.index
        templateEndIndex = endMatch.index
        const aiPart = template.substring(
          startMatch.index + 8,
          endMatch.index - 3,
        )
        instructionContent = `
        create a part of the slide, not the lesson, not the slide, but the part of the slide,
        this is inspiration:  ${slide.prompt}
        change this part according to inspiration, keep variable names, change values,         output format:
        ''' 
          ${aiPart} 
        '''
        `
      }
    }
    if (!instructionContent)
      instructionContent = `create content for ${slide.type} slide according to  ${slide.prompt}, no comments, no explanations`
    const response = await this.openAIService.run(thread_id, {
      assistant_id,
      additional_messages: [
        {
          role: 'user',
          content: instructionContent,
        },
      ],
    })

    let responseText = ''
    if (
      !response ||
      response.length === 0 ||
      !response[0].content ||
      response[0].content.length === 0 ||
      !('text' in response[0].content[0])
    ) {
      console.log('OpenAi Response failed!')
    } else {
      responseText = stripQuotesFromAiResponse(
        response[0].content[0].text.value,
      )
    }
    if (responseText) {
      if (templateEndIndex) {
        responseText =
          template.substring(0, templateStartIndex - 3) +
          responseText +
          template.substring(templateEndIndex + 6)
      }
      const newSlide: CreateLessonContentDto = {
        title: slide.type,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        body: JSON.stringify({ content: responseText }),
        type: LessonContentType.Code,
        active: true,
        draft: false,
        preload_body: slide.starterCode || '',
        solution_body: slide.solutionCode || '',
        tips: '',
        validations: [],
        meta: { order: new Date().getTime() },
      }
      await this.lessonContentManagerService.create(lesson_id, newSlide)
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.recursivelyAddSlides(
      lesson_id,
      thread_id,
      assistant_id,
      slideTemplates,
      slides,
    )
  }

  async recursivelyAddSlidesNew(
    lesson_id: string,
    thread_id: string,
    assistant_id: string,
    slideTemplates: LessonContent[],
    slides: any[],
    slideCreator?: GeneratorParametersAssistant,
  ): Promise<any> {
    if (slides.length === 0) return
    const slide = slides.shift()
    console.log('processing slide remaining ', slides.length)

    const slideType = slide.type.toLocaleLowerCase().trim()
    let currentSlideTemplate = slideTemplates.find(
      (content) => content.title.toLocaleLowerCase() == slideType,
    )
    if (!currentSlideTemplate) {
      console.log('Slide template not found for', slideType)
      currentSlideTemplate = slideTemplates.find(
        (content) => content.title.toLocaleLowerCase() == 'default',
      )
    }
    const OneSlidePromptSlide = slideTemplates.find(
      (content) => content.title == 'One Slide Prompt',
    )
    let OneSlidePrompt = JSON.parse(
      OneSlidePromptSlide?.body as unknown as string,
    )?.content

    if (!currentSlideTemplate) {
      console.log('Slide template not found for', slideType)
      return
    }
    const templateRough = JSON.parse(
      currentSlideTemplate.body as unknown as string,
    ).content
    console.log('slide Type', slideType)
    const template = seperateTemplateForAiQuery(templateRough)

    console.log('template variables', template.variables)
    const params = { ...slide, templateChangeParts: template.variables }
    for (const key in params)
      OneSlidePrompt = OneSlidePrompt.replace(
        `{{${key}}}`,
        params[key as keyof typeof params],
      )
    let responseText = ''
    if (!slideCreator) {
      const response = await this.openAIService.run(thread_id, {
        assistant_id,
        additional_messages: [{ role: 'user', content: OneSlidePrompt }],
      })
      responseText = this.openAIService.parseResponse(response)
    } else {
      responseText = await this.aiprovidersService.run({ ...slideCreator, message: OneSlidePrompt })
    }
    if (responseText) {
      responseText = template.responseToSlide(responseText)
      const newSlide: CreateLessonContentDto = {
        title: slide.name,
        description: slide.type + ' ' + slide.prompt,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        body: JSON.stringify({ content: responseText }),
        type: LessonContentType.Code,
        active: true,
        draft: false,
        preload_body: slide.starterCode || '',
        solution_body: slide.solutionCode || '',
        tips: '',
        validations: [slide.regex],
        meta: { order: new Date().getTime() },
      }
      const lessonContent = await this.lessonContentManagerService.create(
        lesson_id,
        newSlide,
      )

      if (slide.starterCode)
        await this.lessonContentFileService.create({
          name: 'index',
          extension: `HTML`,
          lessonContent: lessonContent,
          preloaded_code: slide.starterCode,
        })
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.recursivelyAddSlidesNew(
      lesson_id,
      thread_id,
      assistant_id,
      slideTemplates,
      slides,
      slideCreator,
    )
  }
  async createLessonUsingN8n(
    userId: string,
    data: CreateLessonUsingOpenAIAssistantProps & { newLessonId: string },
  ): Promise<Lesson> {
    const lessonSlides = await this.lessonService.findOne({
      where: { id: data.lesson_id },
      relations: ['contents', 'integrations'],
    })
    const generatorParametersDB = lessonSlides.contents.find(
      (slide) => slide.title == 'Generator Parameters',
    )
    lessonSlides.integrations.forEach((i) =>
      this.addIntegration(data.newLessonId, i),
    )
    const [createLessonResponse, slideIntro, slideIntroCode] =
      await Promise.all([
        this.n8nRequest('CreateLesson', data),
        this.n8nRequest('CreateSlideIntro', data),
        this.n8nRequest('CreateSlideIntroCode', data),
        this.n8nRequest('chatHistoryAdd',
          JSON.stringify({
            lessonId: data.newLessonId,
            chat: `🎉 The lesson is being prepared. 🚀 Get ready for amazing slides coming your way! 🎨✨`,
            isMe: 0,
          }),
        ),
      ])
    let lesson_new: Lesson
    console.log('slideIntroCode', slideIntroCode)

    lesson_new = await this.lessonService.findOne({
      where: { id: data.newLessonId },
    })

    await this.lessonContentManagerService
      .create(data.newLessonId, {
        title: 'Intro',
        description: 'Intro',
        body: JSON.stringify({ content: slideIntro.output }) as {},
        type: LessonContentType.Code,
        active: true,
        draft: false,
        preload_body: '',
        solution_body: '',
        tips: '',
        slug: '',
        complexity: LessonContentComplexity.Intermediate,
        tags: [],
        validation: '',
        meta: { order: 0 },
      })
      .then((lessonContent) => {
        console.log('slideIntroCode', slideIntroCode)
        this.lessonContentFileService.create({
          name: 'index',
          extension: `HTML`,
          lessonContent: lessonContent,
          preloaded_code: slideIntroCode.output,
        })
      })

    console.log('lesson_new', { lesson_new, createLessonResponse, slideIntro })
    lesson_new.name = createLessonResponse.name || 'Ai Generated Lesson'
    lesson_new.description = createLessonResponse.desc
    lesson_new.duration = createLessonResponse.slides.length * 20 + ''
    lesson_new.head = ''
    lesson_new.independent = true
    lesson_new.tips = ['']
    lesson_new.slug =
      createLessonResponse.slug +
      Math.ceil((new Date().getTime() - 1729692100000) / 6000).toString(36)
    await this.lessonService.update(lesson_new.id, lesson_new)
    console.log('update completed')

    for (const [sIndex, slide] of createLessonResponse.slides.entries()) {
      const slideFromN8n = this.n8nRequest('CreateSlide', {
        slide,
        sIndex,
        lesson: createLessonResponse,
        lessonId: data.newLessonId,
      }).then((slideFromN8n) => {
        console.log(sIndex, 'slideFromN8n created')
        return this.lessonContentManagerService.create(data.newLessonId, slideFromN8n)
      },
      )
    }
    return lesson_new
  }
  async createLessonUsingOpenAIAssistant(
    userId: string,
    data: CreateLessonUsingOpenAIAssistantProps,
    school_id: string,
  ): Promise<Lesson> {
    console.log('User parameters', data)

    const lessonSlides = await this.lessonService.findOne({
      where: { id: data.lesson_id },
      relations: ['contents', 'integrations'],
    })
    const newLessonId = data.newLessonId //prevents typescript undefined
    if (newLessonId) {
      lessonSlides.integrations.forEach((integration) =>
        this.addIntegration(newLessonId || '', integration),
      )
    }

    const planningPromptDB = lessonSlides.contents.find(
      (slide) => slide.title == 'Planning Prompt',
    )
    const generatorParametersDB = lessonSlides.contents.find(
      (slide) => slide.title == 'Generator Parameters',
    )
    data.slideNames = lessonSlides.contents
      .filter(
        (slide) =>
          slide.title != 'Planning Prompt' &&
          slide.title != 'Default' &&
          slide.title != 'Generator Parameters' &&
          slide.title != 'One Slide Prompt',
      )
      .map((slide) => slide.title)
      .join(',')

    if (
      !planningPromptDB ||
      !planningPromptDB.body ||
      !generatorParametersDB ||
      !generatorParametersDB.body
    )
      throw new Error('Lesson Planning prompt or generator params not found')

    let planningPrompt = JSON.parse(planningPromptDB.body as unknown as string)
      .content as string
    const generatorParameters = JSON.parse(
      JSON.parse(generatorParametersDB.body as unknown as string).content,
    ) as GeneratorParameters
    data.NumberOfSlides = generatorParameters.NumberOfSlides

    for (const key in data) {
      planningPrompt = planningPrompt.replace(
        `{{${key}}}`,
        data[key as keyof typeof data] ?? '',
      )
    }
    let lessonSchema: LessonSchema = {
      lessonname: '',
      description: '',
      slides: [],
    };
    let threadId = ''

    if (generatorParameters.LessonCreator) {
      console.log('Using AI Providers for Lesson Creation')
      const anthropicResponse = await this.aiprovidersService.run(
        { ...generatorParameters.LessonCreator, message: planningPrompt }
      );
      console.log(anthropicResponse)
      lessonSchema = JsonParseFromAiResponse(anthropicResponse) as LessonSchema;
    } else {
      console.log('Using OpenAI Service for Lesson Creation')
      const thread = await this.openAIService.threadCreate({
        messages: [{ role: 'user', content: planningPrompt }],
      })
      threadId = thread.id

      const lesson_response = await this.openAIService.run(thread.id, {
        assistant_id: generatorParameters.LessonCreatorAssistant,
      })

      let responseText = this.openAIService.parseResponse(lesson_response)

      console.log('lesson_response', lesson_response[0].content[0])
      lessonSchema = JsonParseFromAiResponse(responseText)
    }
    console.log('lessonSchema', lessonSchema)

    await this.n8nRequest(
      'chatHistoryAdd',
      JSON.stringify({
        lessonId: newLessonId,
        chat: `🎉 The lesson "${lessonSchema.lessonname}" is being prepared. 🚀 Get ready for ${lessonSchema.slides.length} amazing slides coming your way! 🎨✨`,
        isMe: 0,
      }),
    )
    let lesson_new: Lesson
    if (data.newLessonId) {
      lesson_new = await this.lessonService.findOne({
        where: { id: data.newLessonId },
      })
      console.log('lesson_new', lesson_new)
      lesson_new.name = lessonSchema.lessonname || 'Ai Generated Lesson'
      lesson_new.description = lessonSchema.description
      lesson_new.duration = lessonSchema.slides.length * 20 + ''
      lesson_new.head = ''
      lesson_new.independent = true
      lesson_new.tips = ['']
      lesson_new.type = lessonSlides.type || LessonType.PRACTICAL
      lesson_new.slug = (new Date().getTime() - 1729692100000).toString(36)
      await this.lessonService.update(lesson_new.id, lesson_new)
      console.log('update completed')
    } else {
      lesson_new = await this.create(
        userId,
        {
          name: lessonSchema.lessonname || 'Ai Generated Lesson',
          description: lessonSchema.description,
          duration: lessonSchema.slides.length * 20 + '',
          active: true,
          head: '',
          independent: true,
          tips: [''],
          type: lessonSlides.type || LessonType.PRACTICAL,
          slug: (new Date().getTime() - 1729692100000).toString(36),
        },
        school_id,
      )
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    lessonSlides.integrations.forEach((integration) =>
      this.addIntegration(lesson_new.id, integration),
    )
    if (lessonSchema.starterCode)
      lessonSchema.slides[0].starterCode = lessonSchema.starterCode
    if (lessonSchema?.solutionCode)
      lessonSchema.slides[lessonSchema.slides.length - 1].solutionCode =
        lessonSchema?.solutionCode
    this.recursivelyAddSlidesNew(
      lesson_new.id,
      threadId,
      generatorParameters.SlideCreatorAssistant,
      lessonSlides.contents,
      lessonSchema.slides,
      generatorParameters.SlideCreator,
    )
    return lesson_new
  }


  async createLessonUsingOpenAIAssistantBeta(
    userId: string,
    data: any,
    school_id: string,
  ): Promise<Lesson> {
    const lessonSlides = await this.lessonService.findOne({
      where: { id: '07177008-51d6-4707-a9a4-c1b091a41191' },
      relations: ['contents'],
    })
    const lessonInstructions = await this.lessonService.findOne({
      where: { id: '4863319f-7985-4a68-b70b-772a079b5071' },
      relations: ['contents'],
    })

    const assistant = {
      LessonCreator: `asst_gbzm5s2OnVD8cDLYUPCwf693`,
      SlideCreator: `asst_jf6sgmjocSQGqTPlnKvRxu7b`,
    }
    // Check for Dynamic Assistant IDs
    const lessonAssistantSlide = lessonInstructions.contents.find(
      (slide) => slide.title == 'Assistant ID for Lesson',
    )
    if (lessonAssistantSlide?.body) {
      assistant.LessonCreator = JSON.parse(
        lessonAssistantSlide.body as unknown as string,
      ).content as string
    }
    const slideAssistantSlide = lessonInstructions.contents.find(
      (slide) => slide.title == 'Assistant ID for Slide',
    )
    if (slideAssistantSlide?.body) {
      assistant.SlideCreator = JSON.parse(
        slideAssistantSlide.body as unknown as string,
      ).content as string
    }

    // Prepare contents to be sent to the AI
    const instruction = lessonInstructions.contents.find(
      (slide) => slide.title == 'Lesson Generation Instruction',
    )

    if (!instruction || !instruction.body)
      throw new Error('Lesson Generation Instruction not found')

    let instructionContent = JSON.parse(instruction.body as unknown as string)
      .content as string

    for (const key in data) {
      instructionContent = instructionContent.replace(`{{${key}}}`, data[key])
    }

    const thread = await this.openAIService.threadCreate({
      messages: [
        {
          role: 'user',
          content: instructionContent,
        },
      ],
    })

    const lesson_response = await this.openAIService.run(thread.id, {
      assistant_id: assistant.LessonCreator,
    })
    if (
      !lesson_response ||
      lesson_response.length === 0 ||
      !lesson_response[0].content ||
      lesson_response[0].content.length === 0 ||
      !('text' in lesson_response[0].content[0])
    ) {
      throw new Error('OpenAi Response failed!')
    }

    const lessonSchema = JsonParseFromAiResponse(
      (lesson_response[0].content[0] as any).text.value,
    )

    const lesson_new = await this.create(
      userId,
      {
        name: lessonSchema.lessonname || 'Ai Generated Lesson',
        description: lessonSchema.description,
        type: LessonType.PRACTICAL,
        duration: lessonSchema.slides.length * 20 + '',
        active: true,
        head: '',
        independent: true,
        tips: [''],
        slug: (new Date().getTime() - 1729692100000).toString(36),
      },
      school_id,
    )
    this.recursivelyAddSlides(
      lesson_new.id,
      thread.id,
      assistant.SlideCreator,
      lessonSlides.contents,
      lessonSchema.slides,
    )
    return lesson_new
  }

  async askAIHelp(prompt: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await askAIHelp(prompt)
  }
}
