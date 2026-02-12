import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
  Scope,
} from '@nestjs/common'
import _ from 'lodash'

import { LessonContentValidator } from '@/modules/core/lesson-content-validator/lesson-content-validator.entity'
import { LessonContentService } from '@/modules/core/lesson-content/lesson-content.service'
import { LessonContentFileService } from '@/modules/core/lesson-content-file/lesson-content-file.service'
import { LessonService } from '@/modules/core/lesson/lesson.service'
import { SchoolService } from '@/modules/core/school/school.service'
import { UserService } from '@/modules/core/user/user.service'
import { GenerateSlug } from '@/utils/generateSlug'

import { Lesson } from '../../core/lesson/lesson.entity'
import { LessonDeepAssignDTO } from './lesson-deep-assign.dto'

@Injectable({ scope: Scope.REQUEST })
export class LessonDeepAssignService {
  private readonly logger = new Logger(LessonDeepAssignService.name);

  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(LessonService) private lessonService: LessonService,
    @Inject(LessonContentService)
    private lessonContentService: LessonContentService,
    @Inject(LessonContentFileService)
    private lessonContentFileService: LessonContentFileService,
    @Inject(SchoolService)
    private schoolService: SchoolService,
  ) {}

  async CloneLessonToTeacher(
    payload: LessonDeepAssignDTO,
    school_id: string,
  ): Promise<Lesson | NotImplementedException> {
    try {
      this.logger.log(`Cloning lesson ${payload.lesson_id} to teacher ${payload.user_id}`);
      
      const lesson = await this.lessonService.findOne({
        where: { id: payload.lesson_id },
        relations: [
          'contents',
          'contents.files',
          'assigments',
          'units',
          'lessonToUnits',
          'last_slides',
          'skills',
          'integrations',
        ],
      })

      const user = await this.userService.findOne({
        where: { id: payload.user_id },
      })

      if (!lesson || !user) {
        this.logger.warn(`Lesson or user not found: lesson=${!!lesson}, user=${!!user}`);
        return new NotImplementedException('lesson/user cant be located')
      }

      const school = await this.schoolService.findOne({
        where: { id: school_id },
      })
      // Generate a name that doesn't keep adding "- Copy" multiple times
      let newLessonName;
      if (lesson.name.includes(' - Copy')) {
        // If it already has a copy suffix, increment or add a number
        const match = lesson.name.match(/^(.*?)( - Copy( \((\d+)\))?)?$/);
        if (match && match?.length && match[1]) {
          const baseName = match[1];
          const existingNumber = match[4] ? parseInt(match[4], 10) : 1;
          newLessonName = `${baseName} - Copy (${existingNumber + 1})`;
        } else {
          newLessonName = `${lesson.name} - Copy`;
        }
      } else {
        // First time copy
        newLessonName = `${lesson.name} - Copy`;
      }
      
      const duplicatedLesson = await this.lessonService.create({
        ..._.omit(lesson, 'id', 'createdAt', 'updatedAt', 'slug'),
        name: newLessonName,
        slug: GenerateSlug({ name: newLessonName }),
        user: user,
        updatedAt: new Date().toJSON(),
        contents: [],
        assigments: [],
        units: [],
        lessonToUnits: [],
        last_slides: [],
        skills: [],
        school: school,
      })
      
      this.logger.log(`Created duplicated lesson with ID: ${duplicatedLesson.id}`);

      for await (const content of lesson.contents) {
        const validations = content.validations
            ? content.validations.map((v) => ({
                ...v,
                id: new LessonContentValidator().id,
              }))
          : []

        // Create new content for the duplicated lesson
        const newContent = await this.lessonContentService.create({
          ..._.omit(content, 'id', 'createdAt', 'updatedAt', 'files'),
          validations,
          creator: user,
          lesson: duplicatedLesson,
          progress: [],
        })
        
        // Clone files if they exist
        if (content.files && content.files.length > 0) {
          this.logger.log(`Cloning ${content.files.length} files for content ${content.id}`);
          
          for await (const file of content.files) {
            await this.lessonContentFileService.create({
              ..._.omit(file, 'id', 'createdAt', 'updatedAt'),
              lessonContent: newContent
            });
          }
        }
      }

      return duplicatedLesson;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while cloning lesson: ${error.message}`, error.stack);
      } else {
        this.logger.error('Error while cloning lesson: Unknown error', '');
      }
      throw error;
    }
  }
}
