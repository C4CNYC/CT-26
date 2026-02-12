import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { In } from 'typeorm'

import { AssigmentTypes } from '@/modules/core/assigment/enums/assigment-type'
import { LessonContentService } from '@/modules/core/lesson-content/lesson-content.service'
import { LessonType } from '@/modules/core/lesson/enums/lesson-type.enum'
import { LessonService } from '@/modules/core/lesson/lesson.service'

import { CreateAssigmentDto } from '../../../api/manager/code-assignment-manager-api/dtos/create-assigment.dto'
import { UpdateAssigmentDto } from '../../../api/manager/code-assignment-manager-api/dtos/update-assigment.dto'
import { Assigment } from '../../core/assigment/assigment.entity'
import { AssigmentService } from '../../core/assigment/assigment.service'
import { ClassService } from '../../core/class/class.service'
import { CourseUnitService } from '../../core/course-unit/course-unit.service'
import { SchoolService } from '../../core/school/school.service'
import { SkillService } from '../../core/skills/skill.service'
import { StudentService } from '../../core/student/student.service'

@Injectable()
export class AssigmentManagerService {
  constructor(
    private studentService: StudentService,
    private assigmentService: AssigmentService,
    private schoolService: SchoolService,
    private skillService: SkillService,
    private classService: ClassService,
    private courseUnitService: CourseUnitService,
    private lessonService: LessonService,
    private lessonContentService: LessonContentService,
  ) {}

  async getList(school_id: string): Promise<Assigment[]> {
    return await this.assigmentService.find(
      { school: { id: school_id } },
      { assignee_classes: true, course: true },
    )
  }

  async getAssigment(id: string): Promise<Assigment> {
    const assigment = await this.assigmentService.findOne({
      where: { id },
      relations: {
        assignee_classes: true,
        skill_tags: true,
        course: true,
        courseUnit: true,
        lesson: true,
      },
    })
    if (!assigment) throw new NotFoundException(`assigment doesn't exist`)
    return assigment
  }

  async create(
    school_id: string,
    {
      classes = [],
      students = [],
      skill_tags = [],
      ...dto
    }: CreateAssigmentDto,
  ): Promise<Assigment> {
    if ((classes && students.length) || (!classes && !students.length)) {
      throw new ConflictException('must be one field students or class_id')
    }
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: { assigments: true },
    })

    const courseUnit = await this.courseUnitService.findOne({
      where: { id: dto.courseUnitId },
    })

    if (!school) throw new NotFoundException(`school doesn't exist`)

    const skillTags = skill_tags.length
      ? await this.skillService.find({ id: In(skill_tags) })
      : undefined
    const schoolClasses = classes.length
      ? await this.classService.find({ id: In(classes) })
      : undefined
    const schoolStudents = students.length
      ? await this.studentService.find({ id: In(students) })
      : undefined

    let lesson

    if (dto.type === AssigmentTypes.OPEN_PROJECT) {
      lesson = await this.lessonService.create({
        name: dto.name,
        type: LessonType.OPEN_PROJECT,
      })

      const content = await this.lessonContentService.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        body: dto.lessonTitle,
        title: dto.name,
      })
      lesson.contents = [{ ...content }]
      await this.lessonService.repository.save(lesson)
    }
    if (dto.type === AssigmentTypes.MY_CREATIONS) {
      lesson = await this.lessonService.findOne({ where: { id: dto.lessonId } })
    }

    const assignment = await this.assigmentService.create({
      ...dto,
      school: school,
      courseUnit,
      lesson,
      skill_tags: skill_tags.length ? skillTags : undefined,
      assignee_classes: classes.length ? schoolClasses : undefined,
      assignee_students: students.length ? schoolStudents : undefined,
    })

    return assignment
  }

  async update(
    id: string,
    { skill_tags, ...dto }: UpdateAssigmentDto,
  ): Promise<void> {
    const assignment = await this.getAssigment(id)
    const courseUnit = await this.courseUnitService.findOne({
      where: { id: dto.courseUnitId },
    })
    const lesson = await this.lessonService.findOne({
      where: { id: dto.lessonId },
    })
    if (dto.type === AssigmentTypes.OPEN_PROJECT) {
      const content = await this.lessonContentService.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        body: dto.lessonTitle,
        title: dto.name,
      })
      lesson.contents = [{ ...content }]
      await this.lessonService.repository.save({ ...lesson, name: dto.name })
    }

    await this.assigmentService.update(id, { ...dto, courseUnit, lesson })

    if (skill_tags) {
      assignment.skill_tags = skill_tags.length
        ? await this.skillService.find({ id: In(skill_tags) })
        : []
    }

    await this.assigmentService.repository.save({
      ...assignment,
      ...dto,
      courseUnit,
      lesson,
    })
  }

  async remove(id: string): Promise<void> {
    await this.getAssigment(id)
    await this.assigmentService.remove(id)
  }
}
