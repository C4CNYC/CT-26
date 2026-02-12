import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { ProgressStudentLesson } from '@/api/manager/course-progress-manager-api/dtos/progress-student-lesson'

import { CourseProgressSearch } from '../../../api/manager/course-progress-manager-api/dtos/course-progress-search'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseProgress } from './course-progress.entity'

@Injectable()
export class CourseProgressService extends BaseService<CourseProgress> {
  constructor(
    @InjectRepository(CourseProgress)
    public repository: Repository<CourseProgress>,
  ) {
    super(CourseProgress, repository)
  }
  async getLessonProgressByStudent(
    student_id: string,
  ): Promise<ProgressStudentLesson[]> {
    return await this.getRepository()
      .createQueryBuilder('progress')
      .innerJoin('progress.student', 'student') // Add this line to join the student
      .innerJoin('progress.completed_chalanges', 'challenge')
      .innerJoin('challenge.lesson', 'lesson')
      .select('lesson.id', 'lessonId')
      .addSelect('COUNT(challenge.id)', 'numberOfCompletedChallenges')
      .where('student.id = :student_id', { student_id }) // Change to use student.id
      .groupBy('lesson.id')
      .getRawMany()
  }

  async getList(
    page_options_dto: CourseProgressSearch,
  ): Promise<PageDto<CourseProgress>> {
    const query_builder = this.getRepository().createQueryBuilder('progress')

    try {
      this.applyOptionalFilters(query_builder, page_options_dto)
        .leftJoinAndSelect('progress.student', 'student')
        .leftJoinAndSelect(
          'progress.completed_chalanges',
          'completed_chalanges',
        )
        .orderBy('progress.createdAt', Order.ASC)
        .skip(page_options_dto.skip)
        .take(page_options_dto.take)
    } catch (ex) {
      console.error(ex)
    }

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<CourseProgress>,
    filters: CourseProgressSearch,
  ): SelectQueryBuilder<CourseProgress> {
    const { course_id } = filters
    if (course_id)
      query
        .innerJoin('progress.course', 'course')
        .andWhere(`course.id = :course_id`, {
          course_id,
        })
    return query
  }
}
