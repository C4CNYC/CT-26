import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm'

import { LessonSearchOptions } from '../../../api/manager/lesson-manager-api/dtos/lesson-search-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { LessonToCourseUnit } from '../course-unit/lesson-to-course-unit.entity'
import { LessonContent } from '../lesson-content/lesson-content.entity'
import { ContinueLessonRaw } from '../student-lesson-progress/student-lesson-progress.service'
import { Lesson } from './lesson.entity'

@Injectable()
export class LessonService extends BaseService<Lesson> {
  constructor(
    @InjectRepository(Lesson)
    public repository: Repository<Lesson>,
  ) {
    super(Lesson, repository)
  }
  async create(data: DeepPartial<Lesson>): Promise<Lesson> {
    if (!data.slug) {
      data.slug = (new Date().getTime() - 1729692100000).toString(36)
    }
    return await super.create(data)
  }

  async getLesson(id: string, studentId?: string): Promise<Lesson> {
    const query_builder = this.getRepository()
      .createQueryBuilder('l')
      .where('l.id = :id', { id })
      .leftJoinAndSelect('l.contents', 'contents')
      .leftJoinAndSelect('contents.validations', 'validations')
      .leftJoinAndSelect('l.integrations', 'integrations')
      .leftJoinAndSelect('l.skills', 'skills')
      .leftJoinAndSelect('l.environments', 'environments')

    if (studentId)
      query_builder
        .leftJoinAndSelect('contents.progress', 'progress')
        .leftJoinAndSelect(
          'progress.student',
          'student',
          'student.id = :studentId',
          { studentId },
        )

    const data = await query_builder.getOneOrFail()

    data.contents = data.contents.map((content) => ({
      ...content,
      progress: content?.progress?.filter((progress) => !!progress.student),
    }))

    return data
  }

  async getLessonWithoutContent(
    id: string,
    studentId?: string,
  ): Promise<Lesson> {
    const query_builder = this.getRepository()
      .createQueryBuilder('l')
      .where('l.id = :id', { id })
      .leftJoinAndSelect('l.contents', 'contents')
      .leftJoinAndSelect('contents.validations', 'validations')
      .leftJoinAndSelect('l.integrations', 'integrations')
      .leftJoinAndSelect('l.skills', 'skills')
      .leftJoinAndSelect('l.environments', 'environments')

    if (studentId)
      query_builder
        .leftJoinAndSelect('contents.progress', 'progress')
        .leftJoinAndSelect(
          'progress.student',
          'student',
          'student.id = :studentId',
          { studentId },
        )

    const data = await query_builder.getOneOrFail()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.contents = undefined

    return data
  }

  async getByStudentAndUnit(
    student_id: string,
    unit_id: string,
  ): Promise<Lesson[]> {
    const query_builder = this.getRepository()
      .createQueryBuilder('l')
      .distinct()
      .andWhere('l.active = true')
      .leftJoin('l.units', 'units')
      .andWhere('units.id = :unit_id', { unit_id })
      .select(
        'l.*, student_progress_challenges.completed_challenges * 100 / lesson_challenges.challenges as progress',
      )
      .leftJoin(
        (database) =>
          database
            .select(
              'COUNT(distinct progress.id) as completed_challenges, lesson.id as lesson_id',
            )
            .from(LessonContent, 'contents')
            .innerJoin(
              'contents.validations',
              'validations',
              'validations.regex is not null',
            )
            .leftJoin('contents.progress', 'progress')
            .leftJoin('progress.student', 'student')
            .where('student.id = :student_progress_id', {
              student_progress_id: student_id,
            })
            .groupBy('lesson.id'),
        'student_progress_challenges',
        'l.id = student_progress_challenges.lesson_id',
      )
      .leftJoin(
        (database) =>
          database
            .select(
              'COUNT(distinct contents.id) as challenges, lesson.id as lesson_id',
            )
            .from(Lesson, 'lesson')
            .leftJoin('lesson.contents', 'contents')
            .innerJoin(
              'contents.validations',
              'validations',
              'validations.regex is not null',
            )
            .having('COUNT(validations.id) > 0')
            .groupBy('lesson.id'),
        'lesson_challenges',
        'l.id = lesson_challenges.lesson_id',
      )

    return await query_builder.getRawMany()
  }

  async getList(
    page_options_dto: LessonSearchOptions,
    school_id?: string,
  ): Promise<PageDto<Lesson>> {
    const query_builder = this.getRepository().createQueryBuilder('lesson')

    this.applyOptionalFilters(query_builder, page_options_dto)

    const { module_id, skip, take } = page_options_dto

    if (module_id) {
      query_builder.addSelect('lessonToUnits.sort', 'sort')
      query_builder.addOrderBy('sort', Order.ASC)
    }

    if (school_id) {
      query_builder.leftJoin('lesson.school', 'school')
      query_builder.andWhere('school.id = :school_id', { school_id })
    }

    query_builder
      .addOrderBy('lesson.createdAt', Order.DESC)
      .skip(skip)
      .take(take)
    const item_count = await query_builder.getCount()
    const { entities, raw } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(
      !module_id
        ? entities
        : entities.map((entity, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            ;(entity as any).sort = raw[index].sort
            return entity
          }),
      page_meta_dto,
    )
  }

  async getListByUserId(
    user_id: string,
    page_options_dto: LessonSearchOptions,
    school_id?: string,
  ): Promise<PageDto<Lesson>> {
    const query_builder = this.getRepository().createQueryBuilder('lesson')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .andWhere('lesson.userId = :user_id', { user_id })
      .orderBy('lesson.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const { module_id, skip, take } = page_options_dto

    if (module_id) {
      query_builder.addSelect('lessonToUnits.sort', 'sort')
      query_builder.addOrderBy('sort', Order.ASC)
    }

    if (school_id) {
      query_builder.leftJoin('lesson.schools', 'schools')
      query_builder.andWhere('schools.id = :school_id', { school_id })
    }

    query_builder
      .addOrderBy('lesson.createdAt', Order.ASC)
      .skip(skip)
      .take(take)

    const item_count = await query_builder.getCount()
    const { entities, raw } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(
      !module_id
        ? entities
        : entities.map((entity, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            ;(entity as any).sort = raw[index].sort
            return entity
          }),
      page_meta_dto,
    )
  }

  async findFirstLessonByCourse(
    courseId: string,
  ): Promise<ContinueLessonRaw | undefined> {
    return await this.repository
      .createQueryBuilder('lesson')
      .innerJoin('lesson.lessonToUnits', 'ltu')
      .innerJoin('ltu.courseUnit', 'unit')

      .innerJoin(
        'courses_units_course_units',
        'cu',
        'cu."courseUnitsId" = unit.id',
      )
      .innerJoin('courses', 'course', 'course.id = cu."coursesId"')

      .where('course.id = :courseId', { courseId })
      .orderBy('ltu.sort', 'ASC')
      .addOrderBy('lesson.createdAt', 'ASC')

      .select([
        'lesson.id AS "lessonId"',
        'unit.id AS "unitId"',
        'course.id AS "courseId"',
      ])
      .getRawOne<ContinueLessonRaw>()
  }

  async findFirstLessonByUnit(
    unitId: string,
  ): Promise<ContinueLessonRaw | undefined> {
    return await this.repository
      .createQueryBuilder('lesson')
      .innerJoin('lesson.lessonToUnits', 'ltu')
      .innerJoin('ltu.courseUnit', 'unit')

      .where('unit.id = :unitId', { unitId })

      .orderBy('ltu.sort', 'ASC')
      .addOrderBy('lesson.createdAt', 'ASC')

      .select([
        'lesson.id AS "lessonId"',
        'unit.id AS "unitId"',
        `(SELECT cuc."coursesId"
        FROM courses_units_course_units cuc
        WHERE cuc."courseUnitsId" = unit.id
        LIMIT 1) AS "courseId"`,
      ])
      .getRawOne<ContinueLessonRaw>()
  }

  async getLessonSort(lessonId: string) {
    return await this.repository
      .createQueryBuilder('l')
      .innerJoin('l.lessonToUnits', 'ltu')
      .where('l.id = :id', { id: lessonId })
      .select('ltu.sort', 'sort')
      .getRawOne<LessonToCourseUnit>()
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Lesson>,
    filters: LessonSearchOptions,
  ): SelectQueryBuilder<Lesson> {
    const { name, module_id, teacherId, slug } = filters
    if (module_id) {
      query.innerJoin(
        'lesson.lessonToUnits',
        'lessonToUnits',
        'lessonToUnits.courseUnitId = :module_id',
        {
          module_id,
        },
      )
    }

    if (name) {
      query.andWhere(`lesson.name ILIKE :name`, {
        name: `%${name}%`,
      })
    }

    if (teacherId) {
      query.andWhere('lesson.userId = :teacherId', { teacherId })
    }
    if (slug) {
      query.andWhere(`lesson.slug = :slug`, { slug })
    }

    return query
  }
}
