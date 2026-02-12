import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { SchoolSearchOptions } from '../../../api/manager/school-student-manager-api/dtos/school-search-options.dto'
import { MyClassmateSearchOptions } from '../../../api/student/student-classmate-api/dtos/my-courses-search-options.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Class } from '../class/class.entity'
import { Course } from '../course/course.entity'
import { LastVisitedData } from './interfaces'
import { Student } from './student.entity'

@Injectable()
export class StudentService extends BaseService<Student> {
  constructor(
    @InjectRepository(Student)
    public repository: Repository<Student>,
  ) {
    super(Student, repository)
  }

  async getPending(
    class_id: string,
    page_options_dto: PageOptionsDto,
  ): Promise<PageDto<Student>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('s')
      .innerJoin('s.pendings', 'pendings')
      .innerJoin('pendings.class', 'class')
      .where('class.id = :class_id', { class_id })
      .orderBy('s.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async getByClass(
    class_id: string,
    page_options_dto: PageOptionsDto,
  ): Promise<PageDto<Student>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('s')
      .innerJoin('s.classes', 'classes')
      .leftJoinAndSelect('s.account', 'account')
      .where('classes.id = :class_id', { class_id })
      .orderBy('s.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async getBySchool(
    school_id: string,
    page_options_dto: SchoolSearchOptions,
  ): Promise<PageDto<Student>> {
    let query_builder = this.getRepository()
      .createQueryBuilder('s')
      .innerJoin('s.school', 'schools')
      .leftJoinAndSelect('s.account', 'account')
      .leftJoinAndSelect('s.socials', 'socials')
      .where('schools.id = :school_id', { school_id })

    query_builder = this.applyOptionalFilters(query_builder, page_options_dto)

    query_builder = query_builder
      .orderBy('s.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  async getClassmates(
    student_id: string,
    page_options_dto: MyClassmateSearchOptions,
  ): Promise<PageDto<Student>> {
    if (!page_options_dto.class_id) {
      return new PageDto(
        [],
        new PageMetaDto({ item_count: 0, page_options_dto }),
      )
    }
    const query_builder = this.getRepository().createQueryBuilder('s')

    const subQuery = this.repository.manager
      .getRepository(Class)
      .createQueryBuilder('c')
      .select('c.id')
      .innerJoin('c.students', 'students')
      .where('students.id = :student_id', { student_id })

    query_builder
      .orderBy('s.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .andWhere('')
      .take(page_options_dto.take)
      .innerJoin('s.classes', 'classes')
      .where(`classes.id IN (${subQuery.getQuery()})`)
      .where('s.id != :my_id', { my_id: student_id })
      .leftJoinAndSelect('s.socials', 'socials')
      .leftJoinAndSelect('s.account', 'account')
      .where('account.id != :my_id', { my_id: student_id })
      .setParameters(subQuery.getParameters())

    if (page_options_dto.class_id) {
      query_builder.andWhere('classes.id = :class_id', {
        class_id: page_options_dto.class_id,
      })
    }

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }

  private applyOptionalFilters(
    query: SelectQueryBuilder<Student>,
    filters: SchoolSearchOptions,
  ): SelectQueryBuilder<Student> {
    const { class_id, name, email } = filters
    const first_name = name && name.split(' ')[0]
    const last_name = name && name.split(' ')[1]
    if (class_id && class_id.length > 0)
      query.innerJoin('s.classes', 'classes').where('classes.id= :class_id', {
        class_id: class_id,
      })
    if (email)
      query.andWhere(`account.email ILIKE :email`, { email: `%${email}%` })
    if (first_name)
      query.andWhere(`s.first_name ILIKE :first_name`, {
        first_name: `%${first_name}%`,
      })
    if (last_name)
      query.andWhere(`s.last_name ILIKE :last_name`, {
        last_name: `%${last_name}%`,
      })
    return query
  }

  async getLastVisitedData(
    studentId: string,
    courseId: string,
  ): Promise<LastVisitedData> {
    const data = (await this.repository.manager
      .getRepository(Course)
      .createQueryBuilder('c')
      .innerJoin('c.students', 'student')
      .where('student.id = :student_id', { student_id: studentId })
      .andWhere('c.id = :course_id', { course_id: courseId })
      .getRawOne()) as {
      lessonId: string
      unitId: string
      courseId: string
    }

    if (!data)
      throw new NotFoundException(
        `Student ${studentId} doesn't have relation with course ${courseId}`,
      )

    const {
      lessonId: lastVisitedLessonId,
      unitId: lastVisitedUnitId,
      courseId: lastVisitedCourseId,
    } = data

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { lastVisitedLessonId, lastVisitedUnitId, lastVisitedCourseId }
  }

  async updateLastVisitedData(student_id: string, params: Partial<Student>) {
    await this.getRepository()
      .createQueryBuilder()
      .update(Student)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      .set(params as QueryDeepPartialEntity<Student>)
      .where('id = :student_id', { student_id })
      .execute()

    return new MessageDto('last visited data updated successfully')
  }
}
