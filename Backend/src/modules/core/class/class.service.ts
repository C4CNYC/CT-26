import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, ILike, Repository } from 'typeorm'

import { ClassSearchOptions } from '../../../api/manager/school-class-manager-api/dtos/class-search-option.dto'
import { MyClassesSearchOptions } from '../../../api/student/students-classes-api/dtos/my-class-search-options.dto'
import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Class } from './class.entity'

export interface ClassProgressResult {
  classInfo: Class;
  progressData: Array<{
    student_id: string;
    lesson_id: string;
    completed_count: string;
  }>;
}

@Injectable()
export class ClassService extends BaseService<Class> {
  constructor(
    @InjectRepository(Class)
    public repository: Repository<Class>,
    
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Class, repository)
  }

  async getClass(class_id: string): Promise<Class> {
    const query_builder = this.getRepository()
      .createQueryBuilder('c')
      .where('c.id = :class_id', { class_id })
      .leftJoinAndSelect('c.school', 'school')
      .leftJoinAndSelect('c.setting', 'setting')
      .leftJoinAndSelect('c.mentors', 'mentors')
      .select([
        'c',
        'school.id',
        'school.name',
        'school.country',
        'school.city',
        'setting.request_join_enable',
        'setting.share_token',
        'mentors.id',
        'mentors.email',
        'mentors.first_name',
        'mentors.last_name',
        'mentors.avatar',
      ])

    return await query_builder.getOneOrFail()
  }

  async getClassProgressOld(class_id: string): Promise<Class> {
    const query_builder = this.getRepository()
      .createQueryBuilder('c')
      .where('c.id = :class_id', { class_id })
      .innerJoinAndSelect('c.students', 'students')
      .leftJoinAndSelect('c.assigments', 'assigments')
      .leftJoinAndSelect('assigments.course', 'course')
      .leftJoinAndSelect('course.units', 'units')
      .leftJoinAndSelect('units.lessons', 'lessons')
      .leftJoinAndSelect('lessons.contents', 'contents')
      .leftJoinAndSelect(
        'contents.validations',
        'validations',
        'validations.regex is not null',
      )
      .leftJoinAndSelect('contents.progress', 'progress')
      .leftJoinAndSelect('progress.student', 'student')
    return await query_builder.getOneOrFail()
  }
  async getClassProgress(class_id: string, student_id?: string): Promise<ClassProgressResult> {
    // First, get the basic class information with assignments
    const classInfo = await this.getRepository()
      .createQueryBuilder('c')
      .where('c.id = :class_id', { class_id })
      .innerJoinAndSelect('c.assigments', 'assigments')
      .leftJoinAndSelect('assigments.course', 'course')
      .leftJoinAndSelect('course.units', 'units')
      .leftJoinAndSelect('units.lessons', 'lessons')
      .getOne();

    if (!classInfo) {
      throw new NotFoundException('Class not found');
    }

    // Get students for the class (filter by student_id if provided)
    const studentsQuery = this.getRepository()
      .createQueryBuilder('c')
      .where('c.id = :class_id', { class_id })
      .innerJoinAndSelect('c.students', 'students');

    if (student_id) {
      studentsQuery.andWhere('students.id = :student_id', { student_id });
    }

    const classWithStudents = await studentsQuery.getOne();
    classInfo.students = classWithStudents?.students || [];

    // Get contents with validations in a separate query
    const lessonIds = classInfo.assigments.flatMap(assignment =>
      assignment.course?.units.flatMap(unit => unit.lessons.map(lesson => lesson.id)) || []
    );

    if (lessonIds.length === 0) {
      return { classInfo, progressData: [] };
    }
    console.log('entering contents query')
    const contents = await this.dataSource
      .createQueryBuilder()
      .select('contents.*')
      .from('lessons-contents', 'contents')
      .leftJoin('lessons-content-validator', 'validations', 'validations.lessonContentId = contents.id AND validations.regex IS NOT NULL')
      .where('contents.lessonId IN (:...lessonIds)', { lessonIds })
      .andWhere('validations.id IS NOT NULL')
      .getRawMany();
    console.log(`contents `, contents.length)
    // Get student IDs for the class
    const studentIds = classInfo.students.map(student => student.id);

    if (studentIds.length === 0) {
      return { classInfo, progressData: [] };
    }

    // Get student progress counts by lessonId and studentId 
    const progressCountQuery = this.dataSource
      .createQueryBuilder()
      .select('s.id as student_id')
      .addSelect('lc.lessonId as lesson_id')
      .addSelect('COUNT(lc.id) as completed_count')
      .from('course-progress', 'cp')
      .innerJoin('cp.student', 's')
      .innerJoin('cp.completed_chalanges', 'lc')
      .where('s.id IN (:...studentIds)', { studentIds })
      // .andwhere('lc.lessonId IN (:...lessonIds)', { lessonIds })
      .groupBy('s.id, lc.lessonId');

    if (student_id) {
      progressCountQuery.andWhere('s.id = :specific_student_id', { specific_student_id: student_id });
    }

    const progressData = await progressCountQuery.getRawMany();
    console.log(`progress`, progressData, progressCountQuery.getQueryAndParameters())
    return { classInfo, progressData };
  }

  async getBySchool(
    school_id: string,
    page_options_dto: PageOptionsDto & ClassSearchOptions,
  ): Promise<PageDto<Class>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('c')
      .innerJoin('c.school', 'school')
      .select(
        'stutents_in_class.total_students, courses_in_class.total_courses, c.*',
      )
      .where('school.id = :school_id', { school_id })
      .andWhere({ name: ILike(`%${page_options_dto.name || ''}%`) })
      .innerJoinAndSelect(
        (database) =>
          database
            .select('COUNT(student.id) as total_students, class.id as class_id')
            .from(Class, 'class')
            .leftJoin('class.students', 'student')
            .groupBy('class.id'),
        'stutents_in_class',
        'c.id = stutents_in_class.class_id',
      )
      .innerJoinAndSelect(
        (database) =>
          database
            .select('COUNT(courses.id) as total_courses, class.id as class_id')
            .from(Class, 'class')
            .leftJoin('class.courses', 'courses')
            .groupBy('class.id'),
        'courses_in_class',
        'c.id = courses_in_class.class_id',
      )
      .orderBy('c.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const data = await query_builder.getRawMany()

    const item_count = await query_builder.getCount()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(data, page_meta_dto)
  }

  async getByStudent(
    student_id: string,
    page_options_dto: MyClassesSearchOptions,
  ): Promise<PageDto<Class>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('c')
      .innerJoin('c.students', 'student')
      .where('student.id = :student_id', { student_id })
      .andWhere({ name: ILike(`%${page_options_dto.name || ''}%`) })
      .leftJoinAndSelect('c.students', 'students')
      .orderBy('c.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const { entities } = await query_builder.getRawAndEntities()
    const item_count = await query_builder.getCount()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(entities, page_meta_dto)
  }
}
