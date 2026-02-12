import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { MyAssignmentsSearchOptions } from '../../../api/student/student-assignments-api/dtos/my-assignment-search-options.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseProgress } from '../course-progress/course-progress.entity'
import { Course } from '../course/course.entity'
import { Assigment } from './assigment.entity'

@Injectable()
export class AssigmentService extends BaseService<Assigment> {
  constructor(
    @InjectRepository(Assigment)
    public repository: Repository<Assigment>,
  ) {
    super(Assigment, repository)
  }

  async checkStudentAccess(
    student_id: string,
    assignment_id: string,
  ): Promise<boolean> {
    const query_builder = this.getRepository()
      .createQueryBuilder('a')
      .innerJoin('a.assignee_classes', 'classes')
      .innerJoin('classes.students', 'students')
      .andWhere('a.id = :assignment_id', { assignment_id })
      .andWhere('students.id = :student_id', { student_id })

    return Boolean(await query_builder.getOne())
  }

  async getByClass(
    student_id: string,
    page_options_dto: MyAssignmentsSearchOptions,
  ): Promise<PageDto<Assigment>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('assignment')
      .innerJoin('assignment.assignee_classes', 'classes')
      .leftJoin('assignment.course', 'course')
      .where('classes.id = :class_id', { class_id: page_options_dto.class_id })
      .orderBy('assignment.createdAt', Order.ASC)
      .leftJoinAndSelect(
        (database) =>
          database
            .select(
              'COUNT(distinct contents.id) as challenges, course.id as course_id',
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
        'course.id = student_progress_chalanges.course_id',
      )
      .leftJoinAndSelect(
        (database) =>
          database
            .select('COUNT(*) as pined, a.id as pined_assignment_id')
            .from(Assigment, 'a')
            .leftJoin('a.pined_by_students', 'pined_by_students')
            // .andWhere("pined_by_students.id = :student_id", { student_id })
            .groupBy('a.id, pined_by_students.id'),
        'pined_assignment',
        'assignment.id = pined_assignment.pined_assignment_id',
      )
      .select([
        'assignment.id as id',
        'assignment.createdAt as createdAt',
        'assignment.name as name',
        'assignment.type as type',
        'assignment.status as status',
        'assignment.duration as duration',
        'assignment.start_date as start_date',
        'assignment.end_date as end_date',
        'assignment.close_date as close_date',
        'assignment.courseId as courseId',
        'assignment.courseUnitId as courseUnitId',
        'assignment.lessonId as lessonId',
        'student_progress_chalanges.completed_chalanges',
        'course_challenges.challenges',
        'student_progress_chalanges.completed_chalanges * 100 / course_challenges.challenges as course_progress',
        'pined_assignment.*',
      ])
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const raws = await query_builder.getRawMany()
    const item_count = await query_builder.getCount()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(raws, page_meta_dto)
  }

  async getByClassPublic(
    page_options_dto: MyAssignmentsSearchOptions,
  ): Promise<PageDto<Assigment>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('assignment')
      .innerJoin('assignment.assignee_classes', 'classes')
      .leftJoin('assignment.course', 'course')
      .where('classes.id = :class_id', { class_id: page_options_dto.class_id })
      .orderBy('assignment.createdAt', Order.ASC)
      .leftJoinAndSelect(
        (database) =>
          database
            .select(
              'COUNT(distinct contents.id) as challenges, course.id as course_id',
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
      // .leftJoinAndSelect(
      //   (database) =>
      //     database
      //       .select(
      //         'COUNT(distinct  completed_chalanges.id) as completed_chalanges, courses.id as course_id',
      //       )
      //       .from(CourseProgress, 'course-progress')
      //       .leftJoin('course-progress.student', 'student')
      //       .where('student.id = :student_progress_id', {
      //         student_progress_id: student_id,
      //       })
      //       .leftJoin(
      //         'course-progress.completed_chalanges',
      //         'completed_chalanges',
      //       )
      //       .leftJoin('completed_chalanges.lesson', 'lesson')
      //       .leftJoin('lesson.units', 'units')
      //       .leftJoin('units.courses', 'courses')
      //       .groupBy('courses.id'),
      //   'student_progress_chalanges',
      //   'course.id = student_progress_chalanges.course_id',
      // )
      .leftJoinAndSelect(
        (database) =>
          database
            .select('COUNT(*) as pined, a.id as pined_assignment_id')
            .from(Assigment, 'a')
            .leftJoin('a.pined_by_students', 'pined_by_students')
            // .andWhere("pined_by_students.id = :student_id", { student_id })
            .groupBy('a.id, pined_by_students.id'),
        'pined_assignment',
        'assignment.id = pined_assignment.pined_assignment_id',
      )
      .select([
        'assignment.id as id',
        'assignment.createdAt as createdAt',
        'assignment.name as name',
        'assignment.type as type',
        'assignment.status as status',
        'assignment.duration as duration',
        'assignment.start_date as start_date',
        'assignment.end_date as end_date',
        'assignment.close_date as close_date',
        'assignment.courseId as courseId',
        'assignment.courseUnitId as courseUnitId',
        'assignment.lessonId as lessonId',
        // 'student_progress_chalanges.completed_chalanges',
        'course_challenges.challenges',
        // 'student_progress_chalanges.completed_chalanges * 100 / course_challenges.challenges as course_progress',
        'pined_assignment.*',
      ])
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const raws = await query_builder.getRawMany()
    const item_count = await query_builder.getCount()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(raws, page_meta_dto)
  }
}
