import { Injectable, NotFoundException } from '@nestjs/common'

import { CatalogCourseService } from '@/modules/core/catalog-course/catalog-course.service'

import { MyCoursesSearchOptions } from '../../../../api/student/student-courses-api/dtos/my-courses-search-options.dto'
import { CourseRatingDto } from '../../../../api/student/student-courses-api/dtos/rating.dto'
import { PageDto } from '../../../../utils/dtos/page.dto'
import { CourseLikeService } from '../../../core/course-like/course-like.service'
import { CourseRatingService } from '../../../core/course-rating/course-rating.service'
import { CourseUnit } from '../../../core/course-unit/course-unit.entity'
import { CourseUnitService } from '../../../core/course-unit/course-unit.service'
import { Course } from '../../../core/course/course.entity'
import { CourseService } from '../../../core/course/course.service'
import { Lesson } from '../../../core/lesson/lesson.entity'
import { LessonService } from '../../../core/lesson/lesson.service'
import { StudentService } from '../../../core/student/student.service'

@Injectable()
export class StudentCoursesManagerService {
  constructor(
    private ratingService: CourseRatingService,
    private courseService: CourseService,
    private courseLikeService: CourseLikeService,
    private courseUnitService: CourseUnitService,
    private lessonService: LessonService,
    private studentService: StudentService,
    private catalogCourseService: CatalogCourseService,
  ) { }

  async updateRating(
    id: string,
    course_id: string,
    dto: CourseRatingDto,
  ): Promise<void> {
    const rating = await this.ratingService.findOne({
      where: { student: { id }, course: { id: course_id } },
    })
    if (rating) {
      await this.ratingService.update(rating.id, { rating: dto.rating })
    }
    await this.ratingService.create({
      student: await this.studentService.findOne({ where: { id } }),
      course: await this.courseService.findOne({ where: { id: course_id } }),
      rating: dto.rating,
    })
  }

  async removeLike(id: string, course_id: string): Promise<void> {
    const like = await this.courseLikeService.findOne({
      where: { course: { id: course_id }, student: { id } },
    })
    if (!like) {
      throw new NotFoundException("you didn't like with course")
    }
    await this.courseLikeService.update(like.id, { liked: false })
  }

  async like(id: string, course_id: string): Promise<void> {
    const student = await this.studentService.findOne({ where: { id } })
    const course = await this.courseService.findOne({
      where: { id: course_id },
    })
    const like = await this.courseLikeService.findOne({
      where: { student: { id: id }, course: { id: course_id } },
    })

    if (!course) {
      throw new NotFoundException("course doesn't exist")
    }

    if (!like) {
      await this.courseLikeService.create({ student, course, liked: true })
    } else {
      await this.courseLikeService.update(like.id, { liked: true })
    }
  }

  async checkCoursePermission(
    student_id: string,
    course_id: string,
  ): Promise<boolean> {
    const course = await this.courseService.findOne({
      where: { id: course_id },
    })
    if (course.public) return true
    // #TODO check pemission
    return true
  }

  async getCourses(
    student_id: string | undefined,
    dto: MyCoursesSearchOptions,
    org_id: string,
  ): Promise<PageDto<Course>> {
    console.log('Getting courses for student:', student_id, 'with options:', dto, 'in org:', org_id);
    let d = new Date().getTime();
    let courses = await
      ((!student_id) ?
        this.catalogCourseService.getPublicCatalogCoursesForOrg(
          dto,
          org_id,
        ) :
        this.catalogCourseService.getStudentCatalogCoursesForOrg(
          student_id,
          dto,
          org_id,
        ))
    console.log('Time taken to get courses:', new Date().getTime() - d, 'ms');
    return courses;
  }

  async getCourseModules(
    studentID: string,
    course_id: string,
  ): Promise<CourseUnit[]> {
    return await this.courseUnitService.getByStudentAndCourse(
      studentID,
      course_id,
    )
  }

  async getCourseLessons(
    studentID: string,
    module_id: string,
  ): Promise<Lesson[]> {
    return await this.lessonService.getByStudentAndUnit(studentID, module_id)
  }

  async getCatalogCourses(
    dto: MyCoursesSearchOptions,
  ): Promise<PageDto<Course>> {
    return await this.courseService.findCatalogCourses(dto)
  }

  async getCourse(student_id: string, course_id: string): Promise<Course> {
    return await this.courseService.getCourse(student_id, course_id)
  }

  async getCourseContent(
    student_id: string | undefined,
    course_id: string,
  ): Promise<Course> {
    return await this.courseService.getCourseWithoutContentAndLessonToUnits(
      course_id,
    )
  }
}
