import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { CourseUnitSearchOptions } from '../../../api/manager/course-unit-manager-api/dtos/course-unit-search-option.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseUnit } from './course-unit.entity'

@Injectable()
export class CourseUnitService extends BaseService<CourseUnit> {
  constructor(
    @InjectRepository(CourseUnit)
    public repository: Repository<CourseUnit>,
  ) {
    super(CourseUnit, repository)
  }

  async getCourseUnit(id: string, studentId?: string): Promise<CourseUnit> {
    const query_builder = this.getRepository()
      .createQueryBuilder('c')
      .where('c.id = :id and c.active = true', { id })
      .leftJoinAndSelect('c.lessonToUnits', 'lessonToUnits')
      .leftJoinAndSelect('lessonToUnits.lesson', 'lesson')
      .leftJoinAndSelect('lesson.contents', 'contents')
      .leftJoinAndSelect('contents.validations', 'validations')
      .leftJoinAndSelect('lesson.skills', 'skills')
      .orderBy('lessonToUnits.sort', 'ASC')
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
    data.lessons = data.lessonToUnits.map(({ lesson }) => ({
      ...lesson,
      contents: lesson.contents.map((content) => ({
        ...content,
        progress: content.progress?.filter((progress) => !!progress?.student),
      })),
    }))

    data.lessonToUnits = []
    data.lessons = data.lessons.map((lesson) => ({
      ...lesson,
      progress:
        (lesson.contents.filter((item) => item.progress?.length).length * 100) /
        lesson.contents.filter((item) => item.validations.length).length,
    }))

    return data
  }

  async getByStudentAndCourse(
    student_id: string,
    course_id: string,
  ): Promise<CourseUnit[]> {
    const query_builder = this.getRepository()
      .createQueryBuilder('u')
      .distinct()
      .andWhere('u.active = true')
      .leftJoin('u.courses', 'courses')
      .andWhere('courses.id = :course_id', { course_id })
      .select(
        'u.*, student_progress_challenges.completed_challenges * 100 / units_challenges.challenges as progress',
      )
      .leftJoin(
        (database) =>
          database
            .select(
              'course-unit.id as unit_id, count(distinct progress.id) as completed_challenges',
            )
            .from(CourseUnit, 'course-unit')
            .leftJoin('course-unit.lessons', 'lessons')
            .leftJoin('lessons.contents', 'contents')
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
            .groupBy('course-unit.id'),
        'student_progress_challenges',
        'u.id = student_progress_challenges.unit_id',
      )
      .leftJoin(
        (database) =>
          database
            .select(
              'COUNT(distinct contents.id) as challenges, course-unit.id as unit_id',
            )
            .from(CourseUnit, 'course-unit')
            .leftJoin('course-unit.lessons', 'lessons')
            .leftJoin('lessons.contents', 'contents')
            .innerJoin(
              'contents.validations',
              'validations',
              'validations.regex is not null',
            )
            .having('COUNT(validations.id) > 0')
            .groupBy('course-unit.id'),
        'units_challenges',
        'u.id = units_challenges.unit_id',
      )
      .orderBy('sort', 'ASC')

    return await query_builder.getRawMany()
  }
  async getList(
    page_options_dto: CourseUnitSearchOptions,
    school_id: string,
  ): Promise<PageDto<CourseUnit>> {
    const query_builder = this.getRepository().createQueryBuilder('unit')

    this.applyOptionalFilters(query_builder, page_options_dto, school_id)
      .orderBy('unit.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async getListByUserId(
    userId: string,
    page_options_dto: CourseUnitSearchOptions,
  ): Promise<PageDto<CourseUnit>> {
    const query_builder = this.getRepository().createQueryBuilder('unit')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .andWhere('unit.userId = :userId', { userId })
      .orderBy('unit.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<CourseUnit>,
    filters: CourseUnitSearchOptions,
    school_id?: string,
  ): SelectQueryBuilder<CourseUnit> {
    const { name, course_id, teacherId } = filters

    if (course_id) {
      query
        .innerJoin('unit.courses', 'courses')
        .andWhere('courses.id = :course_id', { course_id })
    }

    if (school_id) {
      query
        .leftJoin('unit.school', 'school')
        .andWhere('school.id = :school_id', { school_id })
    }

    if (name) {
      query.andWhere('unit.name ILIKE :name', { name: `%${name}%` })
    }

    if (teacherId) {
      query
        .innerJoin('unit.teachers', 'teachers')
        .andWhere('teachers.id = :teacherId', { teacherId })
    }

    return query
  }
}
