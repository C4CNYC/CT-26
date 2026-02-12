import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { MyPublicProjectSearchOptions } from '../../../api/student/student-project-api/dtos/public-project-search.dto'
import { MyProjectSearchOptions } from '../../../api/student/student-project-api/dtos/search-project.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { StudentProject } from './student-project.entity'

@Injectable()
export class StudentProjectService extends BaseService<StudentProject> {
  constructor(
    @InjectRepository(StudentProject)
    public repository: Repository<StudentProject>,
  ) {
    super(StudentProject, repository)
  }

  async getPublicProjects(
    page_options_dto: MyPublicProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('project')
      .where('project.public = true')

    if (page_options_dto.student_id) {
      query_builder
        .innerJoin('project.student', 'student')
        .andWhere('student.id = :student_id', {
          student_id: page_options_dto.student_id,
        })
    }

    if (page_options_dto.class_id) {
      query_builder
        .innerJoin('student.classes', 'classes')
        .andWhere('classes.id = :class_id', {
          class_id: page_options_dto.class_id,
        })
    }

    if (page_options_dto.title) {
      query_builder.andWhere('project.title = :title', {
        title: page_options_dto.title,
      })
    }

    query_builder
      .leftJoinAndSelect('project.student', 'student')
      .orderBy('project.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async getByStudent(
    student_id: string,
    page_options_dto: MyProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
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
    query: SelectQueryBuilder<StudentProject>,
    filters: MyProjectSearchOptions,
  ): SelectQueryBuilder<StudentProject> {
    const { username, title, class_id, public: project_publicity } = filters
    if (title) {
      query.andWhere(`project.title ILIKE :title`, {
        title: `%${title}%`,
      })
    }
    if (username) {
      query
        .innerJoin('project.student', 'student')
        .andWhere(`student.username ILIKE :username`, {
          username,
        })
    }
    if (project_publicity) {
      query.andWhere(`student.username ILIKE :project_publicity`, {
        project_publicity,
      })
    }
    if (class_id) {
      query
        .innerJoin('project.student', 'student')
        .leftJoin('student.classes', 'classes')
        .andWhere(`classes.id ILIKE :class_id`, {
          class_id,
        })
    }
    return query
  }
}
