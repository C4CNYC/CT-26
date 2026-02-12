import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import _ from 'lodash'
 
import { LessonContentFile } from '@/modules/core/lesson-content-file/lesson-content-file.entity'
import { LessonContentFileService } from '@/modules/core/lesson-content-file/lesson-content-file.service'
import { LessonContentThreadDiscussionReactionService } from '@/modules/core/lesson-content-thread-discussion-reaction/lesson-content-thread-discussion-reaction.service'
import { LessonContentThreadDiscussion } from '@/modules/core/lesson-content-thread-discussion/lesson-content-thread-discussion.entity'
import { LessonContentThreadDiscussionService } from '@/modules/core/lesson-content-thread-discussion/lesson-content-thread-discussion.service'
import { LessonContentThread } from '@/modules/core/lesson-content-thread/lesson-content-thread.entity'
import { LessonContentThreadService } from '@/modules/core/lesson-content-thread/lesson-content-thread.service'
import { LessonContentService } from '@/modules/core/lesson-content/lesson-content.service'
import { LessonType } from '@/modules/core/lesson/enums/lesson-type.enum'
import { LessonService } from '@/modules/core/lesson/lesson.service'
import { StudentLessonFile } from '@/modules/core/student-lesson-file/student-lesson-file.entity'
import { StudentLessonFileService } from '@/modules/core/student-lesson-file/student-lesson-file.service'
import { MessageDto } from '@/utils/dtos/message.dto'

import { StudentService } from '../../core/student/student.service'
import { CourseProgressManagerService } from '../course-progress-manager/course-progress-manager.service'

@Injectable()
export class WorkspaceManagerService {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
    private fileService: LessonContentFileService,
    private lessonContentService: LessonContentService,
    private studentFileService: StudentLessonFileService,
    private lessonContentThreadService: LessonContentThreadService,
    private courseProgressManagerService: CourseProgressManagerService,
    private lessonContentThreadDiscussionService: LessonContentThreadDiscussionService,
    private lessonContentThreadDiscussionReactionService: LessonContentThreadDiscussionReactionService,
  ) {}

  async getFiles(
    studentId: string,
    lessonContentId: string,
    lessonId: string,
  ): Promise<StudentLessonFile[]> {
    const lesson = await this.lessonService.findOne({
      where: { id: lessonId, contents: { id: lessonContentId } },
    })

    if (!lesson) return []

    let files: StudentLessonFile[] = []
    let preloadedFiles: LessonContentFile[] = []

    const student = await this.studentService.findOne({
      where: { id: studentId },
    })

    switch (lesson.type) {
      case LessonType.EXERCISE:
        files = await this.studentFileService.find(
          {
            student: { id: studentId },
            lessonContent: { id: lessonContentId },
          },
          undefined,
          undefined,
          { name: 'ASC' },
        )

        if (files.length) return files

        preloadedFiles = await this.fileService.find({
          lessonContent: { id: lessonContentId },
        })

        for await (const preloadedFile of preloadedFiles) {
          await this.studentFileService.create({
            student,
            lessonContent: await this.lessonContentService.findOne({
              where: { id: lessonContentId },
            }),
            name: preloadedFile.name,
            body: preloadedFile.preloaded_code,
            extension: preloadedFile.extension,
          })
        }

        files = await this.studentFileService.find(
          {
            student: { id: studentId },
            lessonContent: { id: lessonContentId },
          },
          undefined,
          undefined,
          { name: 'ASC' },
        )

        if (files.length) return files

        return [
          await this.studentFileService.create({
            student,
            body: '',
            name: `hello_${Math.random().toString(36).substring(2, 15)}`,
            extension: `HTML`,
            lesson: await this.lessonService.findOne({
              where: { id: lessonId },
            }),
            lessonContent: await this.lessonContentService.findOne({
              where: { id: lessonContentId },
            }),
          }),
        ]
      case LessonType.PRACTICAL:
      default:
        files = await this.studentFileService.find(
          {
            student: { id: studentId },
            lesson: { id: lessonId },
          },
          undefined,
          undefined,
          { name: 'ASC' },
        )

        preloadedFiles = await this.fileService.find({
          lessonContent: { id: lessonContentId },
        })

        for await (const preloadedFile of preloadedFiles) {
          const isFileExist = files.find(
            (file) =>
              file.name === preloadedFile.name &&
              file.extension === preloadedFile.extension,
          )

          if (isFileExist) {
            continue
          }

          await this.studentFileService.create({
            lesson,
            student,
            name: preloadedFile.name,
            body: preloadedFile.preloaded_code,
            extension: preloadedFile.extension,
          })
        }

        files = await this.studentFileService.find(
          {
            student: { id: studentId },
            lesson: { id: lessonId },
          },
          undefined,
          undefined,
          { name: 'ASC' },
        )

        if (files.length) return files

        return [
          await this.studentFileService.create({
            lesson,
            student,
            body: '',
            name: `hello_${Math.random().toString(36).substring(2, 15)}`,
            extension: `HTML`,
          }),
        ]
    }
  }

  async carryOverLessonFiles(
    studentId: string,
    lessonId: string,
    prevLessonId: string,
  ): Promise<MessageDto> {
    const lesson = await this.lessonService.findOne({ where: { id: lessonId } })
    const prevLesson = await this.lessonService.findOne({
      where: { id: prevLessonId },
    })

    if (!lesson || !prevLesson) {
      throw new NotFoundException('Prev or current lesson not found')
    }

    if (
      lesson.type === LessonType.EXERCISE ||
      prevLesson.type === LessonType.EXERCISE
    ) {
      throw new ConflictException(
        'Cannot carry over files from or to exercise lessons',
      )
    }

    if (lesson.independent) {
      throw new ConflictException(
        'Cannot carry over files to independent lessons',
      )
    }

    const prevFiles = await this.studentFileService.find({
      student: { id: studentId },
      lesson: { id: prevLessonId },
    })

    let nextFiles = await this.studentFileService.find({
      student: { id: studentId },
      lesson: { id: lessonId },
    })

    const filesToCarryOver = prevFiles.filter(
      (prevFile) =>
        !nextFiles.find(
          (nextFile) =>
            nextFile.name === prevFile.name &&
            nextFile.extension === prevFile.extension,
        ),
    )

    for await (const file of filesToCarryOver) {
      await this.studentFileService.create({
        student: await this.studentService.findOne({
          where: { id: studentId },
        }),
        lesson,
        name: file.name,
        body: file.body,
        extension: file.extension,
      })
    }

    if (
      !(await this.courseProgressManagerService.isLessonStudentProgressOver90Percent(
        studentId,
        prevLessonId,
      ))
    ) {
      nextFiles = await this.studentFileService.find({
        student: { id: studentId },
        lesson: { id: lessonId },
      })

      const LessonContent = await this.lessonContentService.find({
        lesson: { id: lessonId },
      })

      const firstLessonContent = LessonContent.sort(
        (a, b) => Number(a?.meta?.order) - Number(b?.meta?.order),
      )[0]

      const files = await this.fileService.find({
        lessonContent: { id: firstLessonContent.id },
      })

      const filesToRewrite = nextFiles.filter((prevFile) =>
        files.find(
          (nextFile) =>
            nextFile.name === prevFile.name &&
            nextFile.extension === prevFile.extension,
        ),
      )

      for await (const file of filesToRewrite) {
        const bodyToRewrite = files.find(
          (nextFile) =>
            nextFile.name === file.name &&
            nextFile.extension === file.extension,
        )?.preloaded_code

        if (!bodyToRewrite) continue

        await this.studentFileService.update(file.id, {
          body: bodyToRewrite,
        })
      }
    }

    return new MessageDto('Files carried over successfully')
  }

  async getThreadsByFileId(fileId: string): Promise<LessonContentThread[]> {
    return await this.lessonContentThreadService.find(
      {
        file: { id: fileId },
      },
      { owner: true },
    )
  }

  async getDiscussionsByThreadId(
    threadId: string,
  ): Promise<LessonContentThreadDiscussion[]> {
    return await this.lessonContentThreadDiscussionService.find(
      {
        thread: { id: threadId },
      },
      { owner: true, reactions: { owner: true } },
    )
  }

  async createFile(
    studentID: string,
    lessonId: string,
    name: string,
    body: string,
    extension: string,
    lessonContentId: string,
  ): Promise<StudentLessonFile> {
    let file: Partial<StudentLessonFile> = {
      name,
      body,
      extension,
    }
    let isSameFileExist: StudentLessonFile
    const lesson = await this.lessonService.findOne({ where: { id: lessonId } })

    switch (lesson.type) {
      case LessonType.EXERCISE:
        isSameFileExist = await this.studentFileService.findOne({
          where: {
            name,
            extension,
            student: { id: studentID },
            lessonContent: { id: lessonContentId },
          },
        })

        if (isSameFileExist) {
          throw new ConflictException('File with the same name already exists')
        }

        file = {
          ...file,
          student: await this.studentService.findOne({
            where: { id: studentID },
          }),
          lessonContent: await this.lessonContentService.findOne({
            where: { id: lessonContentId },
          }),
          lesson: await this.lessonService.findOne({
            where: { id: lessonId },
          }),
        }
        break
      case LessonType.PRACTICAL:
      default:
        isSameFileExist = await this.studentFileService.findOne({
          where: {
            name,
            extension,
            student: { id: studentID },
            lessonContent: { id: lessonContentId },
          },
        })

        if (isSameFileExist) {
          throw new ConflictException('File with the same name already exists')
        }

        file = {
          ...file,
          student: await this.studentService.findOne({
            where: { id: studentID },
          }),
          lesson: await this.lessonService.findOne({
            where: { id: lessonId },
          }),
        }
        break
    }

    return await this.studentFileService.create({
      ...file,
      student: await this.studentService.findOne({ where: { id: studentID } }),
    })
  }

  async createThread(
    studentId: string,
    fileId: string,
    message: string,
  ): Promise<LessonContentThread> {
    return await this.lessonContentThreadService.create({
      message,
      owner: await this.studentService.findOne({ where: { id: studentId } }),
      file: await this.studentFileService.findOne({ where: { id: fileId } }),
    })
  }

  async updateThread(id: string, message: string): Promise<MessageDto> {
    await this.lessonContentThreadService.update(id, { message })
    return new MessageDto('Thread updated successfully')
  }

  async createThreadDiscussion(
    studentId: string,
    threadId: string,
    message: string,
  ): Promise<MessageDto> {
    await this.lessonContentThreadDiscussionService.create({
      message,
      owner: await this.studentService.findOne({ where: { id: studentId } }),
      thread: await this.lessonContentThreadService.findOne({
        where: { id: threadId },
      }),
    })

    return new MessageDto('Discussion created successfully')
  }

  async updateThreadDiscussion(
    id: string,
    message: string,
  ): Promise<MessageDto> {
    await this.lessonContentThreadDiscussionService.update(id, { message })
    return new MessageDto('Discussion updated successfully')
  }

  async createThreadDiscussionReaction(
    student_id: string,
    discussion_id: string,
    message: string,
  ): Promise<MessageDto> {
    await this.lessonContentThreadDiscussionReactionService.create({
      message,
      owner: { id: student_id },
      discussion: { id: discussion_id },
    })

    return new MessageDto('Reaction created successfully')
  }

  async updateFile(
    id: string,
    name: string,
    body: string,
    extension: string,
  ): Promise<MessageDto> {
    await this.studentFileService.update(
      id,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      _.omitBy({ name, body, extension }, _.isNil),
    )

    return new MessageDto('File updated successfully')
  }

  async deleteThreadDiscussionReaction(id: string): Promise<MessageDto> {
    await this.lessonContentThreadDiscussionReactionService.remove(id)
    return new MessageDto('Reaction deleted successfully')
  }

  async deleteThreadDiscussion(discussionId: string): Promise<MessageDto> {
    await this.lessonContentThreadDiscussionService.remove(discussionId)
    throw new Error('Thread discussion deleted successfully.')
  }

  async deleteThread(threadId: string): Promise<MessageDto> {
    await this.lessonContentThreadService.remove(threadId)
    return new MessageDto('Thread deleted successfully')
  }

  async deleteFile(id: string): Promise<MessageDto> {
    await this.studentFileService.remove(id)
    return new MessageDto('File deleted successfully')
  }

  /* --------------- UNAUTHORIZED USER --------------- */

  async getFilesByUnauthUser(
    lessonContentId: string,
    lessonId: string,
  ): Promise<Partial<StudentLessonFile>[]> {
    const lesson = await this.lessonService.findOne({
      where: { id: lessonId, contents: { id: lessonContentId } },
    })

    if (!lesson) return []

    const files = await this.fileService.find({
      lessonContent: { id: lessonContentId },
    })

    if (files.length)
      return files.map((file) => ({
        id: file.id,
        name: file.name,
        extension: file.extension,
        body: file.preloaded_code,
      }))

    switch (lesson.type) {
      case LessonType.EXERCISE:
        return [
          {
            id: 'default_index',
            name: `hello_${Math.random().toString(36).substring(2, 15)}`,
            extension: `HTML`,
            body: '',
          },
        ]
      default:
        return []
    }
  }
}
