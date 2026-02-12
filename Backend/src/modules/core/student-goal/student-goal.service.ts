import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { MyGoalSearchOptions } from '../../../api/student/student-goal-api/dtos/search-goal.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { StudentGoal } from './student-goal.entity'

@Injectable()
export class StudentGoalService extends BaseService<StudentGoal> {
  constructor(
    @InjectRepository(StudentGoal)
    public repository: Repository<StudentGoal>,
  ) {
    super(StudentGoal, repository)
  }

  async getByStudent(
    student_id: string,
    page_options_dto: MyGoalSearchOptions,
  ): Promise<PageDto<StudentGoal>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('project')
      .innerJoin('project.student', 'student')
      .where('student.id = :student_id', { student_id })

    this.applyOptionalFilters(query_builder, page_options_dto)
      .orderBy('project.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<StudentGoal>,
    filters: MyGoalSearchOptions,
  ): SelectQueryBuilder<StudentGoal> {
    const { title } = filters
    if (title) {
      query.andWhere(`project.title ILIKE :title`, {
        title: `%${title}%`,
      })
    }
    return query
  }
}
