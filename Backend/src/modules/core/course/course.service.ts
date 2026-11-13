import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { CourseSearchOptions } from '../../../api/manager/course-manager-api/dtos/course-search-option.dto'
import { MyCoursesSearchOptions } from '../../../api/student/student-courses-api/dtos/my-courses-search-options.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseProgress } from '../course-progress/course-progress.entity'
import { Course } from './course.entity'

export interface LessonCoursePlacement {
  courseId: string
  unitId: string
}

@Injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    public repository: Repository<Course>,
  ) {
    super(Course, repository)
  }

  async getCourse(student_id: string, course_id: string) {
    const query_builder = this.getRepository()
      .createQueryBuilder('course')
      .distinct()
      .where('course.id = :course_id', { course_id })
      .select(
        'course.*, student_progress_chalanges.completed_chalanges * 100 / course_challenges.total_challenges as progress , course_challenges.total_challenges as total, student_progress_chalanges.completed_chalanges as completed',
      )
      .leftJoin(
        (database) =>
          database
            .select(
              'COUNT(distinct  completed_chalanges.id) as completed_chalanges, courses.id as course_id',
            )
            .from(CourseProgress, 'course-progress')
            .leftJoin('course-progress.student', 'student')
            .where('student.id = :student_progress_id', {
              student_progress_id: student_id,
            })
            .leftJoin(
              'course-progress.completed_chalanges',
              'completed_chalanges',
            )
            .leftJoin('completed_chalanges.lesson', 'lesson')
            .leftJoin('lesson.units', 'units')
            .leftJoin('units.courses', 'courses')
            .groupBy('courses.id'),
        'student_progress_chalanges',
        'course.id = student_progress_chalanges.course_id',
      )
      .leftJoin(
        (database) =>
          database
            .select(
              'course.id as course_id, count(distinct contents.id) as total_challenges',
            )
            .from(Course, 'course')
            .leftJoin('course.units', 'units')
            .leftJoin('units.lessons', 'lessons')
            .leftJoin('lessons.contents', 'contents')
            .innerJoin(
              'contents.validations',
              'validations',
              'validations.regex is not null',
            )
            .having('COUNT(validations.id) > 0')
            .groupBy('course.id'),
        'course_challenges',
        'course.id = course_challenges.course_id',
      )

    return (await query_builder.getRawOne()) as Course & { progress: string }
  }

  async getList(
    page_options_dto: CourseSearchOptions,
    school_id: string,
  ): Promise<PageDto<Course>> {
    const query_builder = this.getRepository().createQueryBuilder('course')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .orderBy('course.createdAt', Order.ASC)
      .leftJoinAndSelect('course.units', 'units')
      .leftJoin('course.schools', 'schools')
      .andWhere('schools.id = :school_id', { school_id })
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async findByStudent(
    student_id: string,
    page_options_dto: MyCoursesSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    const queryBuilder2 = this.getRepository().createQueryBuilder('course')
    const courseUnits = await this.applyOptionalFilters(
      queryBuilder2,
      page_options_dto,
    )
      .andWhere({ public: true, active: true, catalog: true })
      .leftJoinAndSelect('course.units', 'units')
      .andWhere('units.active = :active', { active: 't' })
      .orderBy('course.createdAt', Order.ASC)
      .orderBy('units.sort', 'ASC')
      .getMany()

    const query_builder = this.applyOptionalFilters(
      this.getRepository()
        .createQueryBuilder('c')
        .distinct()
        .leftJoin('c.schools', 'schools')
        .leftJoin('schools.organization', 'organization')
        .andWhere('organization.id = :org_id', { org_id })
        .andWhere('c.public = true')
        .andWhere('c.active = true')
        .andWhere('c.catalog = true')
        .select(
          'lessons_in_course.total_lessons, course_likes.likes_count, me_like.liked liked, course_rating.rating as my_rating, c.*, student_progress_chalanges.completed_chalanges * 100 / course_chalanges.chalanges as progress',
        )
        .leftJoin('c.units', 'units')
        .leftJoin('units.lessons', 'lessons')
        .leftJoinAndSelect(
          (database) =>
            database
              .select('COUNT(likes.id) as likes_count, course.id as course_id')
              .from(Course, 'course')
              .leftJoin('course.likes', 'likes')
              .groupBy('course.id'),
          'course_likes',
          'c.id = course_likes.course_id',
        )
        .leftJoinAndSelect(
          (database) =>
            database
              .select(
                'COUNT(distinct contents.id) as chalanges, course.id as course_id',
              )
              .from(Course, 'course')
              .leftJoin('course.units', 'units')
              .leftJoin('units.lessons', 'lessons')
              .leftJoin('lessons.contents', 'contents')
              .innerJoin(
                'contents.validations',
                'validations',
                'validations.regex is not null',
              )
              .having('COUNT(validations.id) > 0')
              .groupBy('course.id'),
          'course_chalanges',
          'c.id = course_chalanges.course_id',
        )
        .leftJoinAndSelect(
          (database) =>
            database
              .select(
                'COUNT(distinct  completed_chalanges.id) as completed_chalanges, courses.id as course_id',
              )
              .from(CourseProgress, 'course-progress')
              .leftJoin('course-progress.student', 'student')
              .where('student.id = :student_progress_id', {
                student_progress_id: student_id,
              })
              .leftJoin(
                'course-progress.completed_chalanges',
                'completed_chalanges',
              )
              .leftJoin('completed_chalanges.lesson', 'lesson')
              .leftJoin('lesson.units', 'units')
              .leftJoin('units.courses', 'courses')
              .groupBy('courses.id'),
          'student_progress_chalanges',
          'c.id = student_progress_chalanges.course_id',
        )
        .leftJoinAndSelect(
          (database) =>
            database
              .select('ratings.rating as rating, course.id as course_id')
              .from(Course, 'course')
              .leftJoin('course.ratings', 'ratings')
              .leftJoin('ratings.student', 'student')
              .andWhere('student.id = :student_id', { student_id }),
          'course_rating',
          'c.id = course_rating.course_id',
        )
        .leftJoinAndSelect(
          (database) =>
            database
              .select('likes.liked, course.id as course_id')
              .from(Course, 'course')
              .leftJoin('course.likes', 'likes')
              .leftJoin('likes.student', 'student')
              .andWhere('student.id = :student_id', { student_id }),
          'me_like',
          'c.id = me_like.course_id',
        )
        .innerJoinAndSelect(
          (database) =>
            database
              .select(
                'COUNT(lessons.id) as total_lessons, course.id as course_id',
              )
              .from(Course, 'course')
              .leftJoin('course.units', 'units')
              .leftJoin('units.lessons', 'lessons')
              .groupBy('course.id'),
          'lessons_in_course',
          'c.id = lessons_in_course.course_id',
        ),
      page_options_dto,
    )
      .orderBy('c.createdAt', Order.ASC)
      .offset(page_options_dto.skip)
      .limit(page_options_dto.take)

    const data = await query_builder.getRawMany()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const unique = [...new Map(data.map((item) => [item.id, item])).values()]
    const unique_with_units = unique.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...item,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        units: courseUnits.find((cu) => cu.id === item.id)?.units,
      }
    })
    const item_count = await query_builder.getCount()

    const page_meta_dto = new PageMetaDto({
      item_count: item_count,
      page_options_dto,
    })

    return new PageDto(unique_with_units, page_meta_dto)
  }

  async getModuleSortedContent(module_id: string): Promise<Course> {
    const query_builder = this.getRepository()
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.units', 'units', 'units.active = :active', {
        active: true,
      })
      .where('units.id = :module_id', { module_id })
      .leftJoinAndSelect(
        'units.lessons',
        'lessons',
        'lessons.active = :active',
        { active: true },
      )
      .leftJoinAndSelect('lessons.contents', 'contents')
      .andWhere('contents.body IS NOT NULL')

    return await query_builder.getOneOrFail()
  }

  async getModuleWithoutContentsInEachLesson(
    module_id: string,
  ): Promise<Course> {
    const query_builder = this.getRepository()
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.units', 'units', 'units.active = :active', {
        active: true,
      })
      .where('units.id = :module_id', { module_id })
      .leftJoinAndSelect(
        'units.lessons',
        'lessons',
        'lessons.active = :active',
        { active: true },
      )

    return await query_builder.getOneOrFail()
  }

  async getCourseContent(course_id: string): Promise<Course> {
    const query_builder = this.getRepository()
      .createQueryBuilder('course')
      .where('course.id = :course_id', { course_id })
      .leftJoinAndSelect('course.units', 'units', 'units.active = :active', {
        active: true,
      })
      .leftJoinAndSelect(
        'units.lessons',
        'lessons',
        'lessons.active = :active',
        { active: true },
      )
      .leftJoinAndSelect('lessons.contents', 'contents')
      .andWhere('contents.body IS NOT NULL')

    return await query_builder.getOneOrFail()
  }

  async findOwnCourses(
    page_options_dto: CourseSearchOptions,
  ): Promise<PageDto<Course>> {
    const query_builder = this.getRepository().createQueryBuilder('course')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .andWhere(`course.userId = :userId`, {
        userId: page_options_dto.user_id,
      })
      .leftJoin('course.units', 'units')
      .orderBy('course.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async findAllPublic(
    page_options_dto: CourseSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    const query_builder = this.getRepository().createQueryBuilder('course')

    this.applyOptionalFilters(query_builder, page_options_dto)
      .leftJoin('course.schools', 'schools')
      .leftJoin('schools.organization', 'organization')
      .andWhere('organization.id = :org_id', { org_id })
      .andWhere({ public: true })
      .leftJoinAndSelect('course.units', 'units')
      .leftJoinAndSelect('units.lessons', 'lessons')
      .andWhere('units.active = :active', { active: 't' })
      .andWhere('lessons.active = :active', { active: 't' })
      .orderBy('course.createdAt', Order.ASC)
      .orderBy('units.sort', 'ASC')
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async findCatalogCourses(
    page_options_dto: CourseSearchOptions,
  ): Promise<PageDto<Course>> {
    const query_builder = this.getRepository().createQueryBuilder('course')
    this.applyOptionalFilters(query_builder, page_options_dto)
      .andWhere({ public: true, catalog: true, active: true })
      .orderBy('course.createdAt', Order.ASC)
      .leftJoinAndSelect('course.units', 'units')
      .leftJoinAndSelect('units.lessons', 'lessons')
      .andWhere('units.active = :active', { active: 't' })
      .andWhere('lessons.active = :active', { active: 't' })
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()
    entities.forEach(
      (course) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (course.total_lessons = course.units.reduce(
          (total, unit) => total + (unit.lessons.length || 0),
          0,
        )),
    )

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Course>,
    filters: CourseSearchOptions,
  ): SelectQueryBuilder<Course> {
    const {
      name,
      school_id,
      class_id,
      catalog = undefined,
      user_id,
      course_id,
    } = filters
    if (school_id)
      query
        .innerJoin('course.schools', 'schools')
        .andWhere(`schools.id = :school_id`, {
          school_id,
        })
    if (class_id)
      query
        .innerJoin('course.classes', 'classes')
        .andWhere(`classes.id IN (:...class_ids)`, {
          class_ids: class_id.split(','),
        })
    if (name)
      query.andWhere(`course.name ILIKE :name`, {
        name: `%${name}%`,
      })
    if (course_id)
      query.andWhere(`course.id = :course_id`, {
        course_id,
      })
    if (catalog) {
      if (catalog === 'true') {
        query.andWhere(`course.catalog = :catalog`, {
          catalog: true,
        })
      } else if (catalog === 'false') {
        query.andWhere(`course.catalog = :catalog`, {
          catalog: false,
        })
      }
    }
    if (user_id && catalog)
      query.andWhere(`course.userId = :userId`, {
        userId: user_id,
      })
    return query
  }

  async getCourseSortedContent(course_id: string) {
    const query_builder = this.getRepository()
      .createQueryBuilder('course')
      .where('course.id = :id', { id: course_id })
      .andWhere('course.active = true')
      .leftJoinAndSelect('course.units', 'unit')
      .andWhere('unit.active = true')
      .leftJoinAndSelect('unit.authors', 'CourseUnitAuthor')
      .leftJoinAndSelect('unit.lessonToUnits', 'lessonToUnits')
      .leftJoinAndSelect('lessonToUnits.lesson', 'lesson')
      .andWhere('lesson.active = true')
      .leftJoinAndSelect(
        'lesson.contents',
        'content',
        'content.body IS NOT NULL',
      )
      .leftJoinAndSelect('lesson.skills', 'skill')
      .leftJoinAndSelect('content.validations', 'validations')
      .orderBy('unit.sort', 'ASC')
      .addOrderBy('lessonToUnits.sort', 'ASC')

    const course = await query_builder.getOne()

    if (!course) {
      const query_builder = this.getRepository()
        .createQueryBuilder('course')
        .where('course.id = :id', { id: course_id })
        .andWhere('course.active = true')
        .leftJoinAndSelect('course.units', 'unit')
        .leftJoinAndSelect('unit.lessonToUnits', 'lessonToUnits')
        .leftJoinAndSelect('lessonToUnits.lesson', 'lesson')
        .leftJoinAndSelect(
          'lesson.contents',
          'content',
          'content.body IS NOT NULL',
        )
        .leftJoinAndSelect('lesson.skills', 'skill')
        .orderBy('unit.sort', 'ASC')
        .addOrderBy('lessonToUnits.sort', 'ASC')
      const c = await query_builder.getOne()
      if (!c)
        throw new NotFoundException(
          'Course not found or no active units/lessons available.',
        )
      else return c
    }
    course.units.forEach((item) => {
      item.lessons = item.lessonToUnits.map(({ lesson }) => lesson)
      item.lessons = item.lessons.map((lesson) => ({
        ...lesson,
        progress: lesson.contents.length
          ? (lesson.contents.filter((item) => item.progress?.length).length *
              100) /
            lesson.contents.filter((item) => item.validations.length).length
          : 0,
      }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      item.progress =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        item.lessons.reduce((acc, cur) => acc + cur.progress, 0) /
        (item.lessons.length || 0)
    })

    return course
  }
  async getCourseWithoutContentAndLessonToUnits(course_id: string) {
    const query_builder = this.getRepository()
      .createQueryBuilder('course')
      .where('course.id = :id', { id: course_id })
      .andWhere('course.active = true')
      .leftJoinAndSelect('course.units', 'unit')
      .andWhere('unit.active = true')
      .leftJoinAndSelect('unit.lessonToUnits', 'lessonToUnits')
      .leftJoinAndSelect('lessonToUnits.lesson', 'lesson')
      .andWhere('lesson.active = true')
      .leftJoinAndSelect('lesson.skills', 'skill')
      .orderBy('unit.sort', 'ASC')
      .addOrderBy('lessonToUnits.sort', 'ASC')

    const course = await query_builder.getOne()
    if (!course)
      throw new NotFoundException(
        'Course not found or no active units/lessons available.',
      )
    course.units.forEach((item) => {
      item.lessons = item.lessonToUnits?.map(({ lesson }) => lesson)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete item.lessonToUnits
    })

    return course
  }

  async findLessonCoursePlacement(
    lesson_id: string,
    student_id?: string,
  ): Promise<LessonCoursePlacement | null> {
    const query_builder = this.getRepository()
      .createQueryBuilder('course')
      .innerJoin('course.units', 'unit')
      .innerJoin('unit.lessonToUnits', 'lessonToUnits')
      .innerJoin('lessonToUnits.lesson', 'lesson')
      .where('lesson.id = :lesson_id', { lesson_id })
      .andWhere('course.active = true')
      .andWhere('unit.active = true')
      .andWhere('lesson.active = true')
      .select(['course.id AS "courseId"', 'unit.id AS "unitId"'])

    if (student_id)
      query_builder
        .leftJoin('course.classes', 'enrolledClass')
        .leftJoin(
          'enrolledClass.students',
          'enrolledStudent',
          'enrolledStudent.id = :student_id',
          { student_id },
        )
        .orderBy('enrolledStudent.id', 'ASC', 'NULLS LAST')

    const placement = await query_builder
      .addOrderBy('course.createdAt', 'ASC')
      .addOrderBy('unit.sort', 'ASC')
      .limit(1)
      .getRawOne<LessonCoursePlacement>()

    return placement ?? null
  }
}
