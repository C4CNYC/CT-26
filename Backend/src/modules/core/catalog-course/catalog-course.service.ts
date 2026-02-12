import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { Order } from '../../../utils/constants/order.enum'
import { PageMetaDto } from '../../../utils/dtos/page-meta.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CourseProgress } from '../course-progress/course-progress.entity'
import { Course } from '../course/course.entity'
import { CatalogCourse } from './catalog-course.entity'
import { CourseUnit } from '../course-unit/course-unit.entity'
import { Student } from '../student/student.entity'
import { CourseRaw } from './catalog-courses.types'

@Injectable()
export class CatalogCourseService extends BaseService<CatalogCourse> {
  private readonly logger = new Logger(CatalogCourseService.name)

  constructor(
    @InjectRepository(CatalogCourse)
    public repository: Repository<CatalogCourse>,
    @InjectRepository(CourseUnit)
    public courseUnitRepository: Repository<CourseUnit>,
  ) {
    super(CatalogCourse, repository)
  }
  async getPublicCatalogCoursesForOrg(
    page_options_dto: PageOptionsDto,
    org_id: string,
  ): Promise<PageDto<Course>> {
    // Stage 1: Get course IDs with a more efficient raw query
    const courseIds = await this.getCourseIds(org_id);
    this.logger.debug(`Fetched Course IDs: ${courseIds.length} items`);
    // Get total count
    const countQuery = `
    SELECT COUNT(DISTINCT courses.id) as count
    FROM catalog_course
    JOIN courses ON catalog_course.course_id = courses.id
    WHERE catalog_course.organization_id = $1
      AND catalog_course.is_show = true
      AND courses.public = true
      AND courses.active = true
      AND courses.catalog = true
  `;

    const countResult = await this.repository.query(countQuery, [org_id]);
    const item_count = parseInt(countResult[0].count);
    this.logger.debug(`Total Count: ${item_count}`);
    if (!courseIds.length) {
      return new PageDto([], new PageMetaDto({ item_count, page_options_dto }));
    }

    // Stage 2: Fetch the full entities
    this.logger.debug(`Course IDs to fetch: ${courseIds.length} items`);
    const courses = await this.repository
      .createQueryBuilder('catalogCourse')
      .distinct(true)
      .leftJoinAndSelect('catalogCourse.course', 'course')
      .leftJoinAndSelect('course.units', 'units', 'units.active = :active', { active: true })
      .leftJoin('lesson_to_course_unit', 'ltcu', 'ltcu.courseUnitId = units.id')
      .leftJoinAndSelect('lessons', 'lessons', 'lessons.id = ltcu.lessonId AND lessons.active = :active', { active: true })
      .where('catalogCourse.course_id IN (:...courseIds)', { courseIds })
      .orderBy('course.createdAt', 'ASC')
      .addOrderBy('units.sort', 'ASC')
      .getMany();

    const result = Object.values(
      courses.reduce<Record<string, CatalogCourse>>((acc, item) => {
        acc[item.course.id] = item;
        return acc;
      }, {})
    ).map((catalog) => {
      const c = catalog.course;

      return {
        ...c,
        course_id: c.id,
        progress: null,
        likes_count: 0,


        total_lessons: c.units.reduce(
          (sum, unit) => sum + (unit.lessons?.length || 0),
          0
        ),

        liked: false,
        my_rating: null,
      };
    });

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto });
    return new PageDto(result, page_meta_dto) as unknown as PageDto<Course>;
  }
  async getStudentCatalogCoursesForOrg(
    student_id: string,
    page_options_dto: PageOptionsDto,
    org_id: string,
  ): Promise<PageDto<any>> {
    // Stage 1: Get Course IDs with Basic Filtering
    const courseIds = await this.getCourseIds(org_id);

    if (courseIds.length === 0) {
      return new PageDto([], new PageMetaDto({
        item_count: 0,
        page_options_dto,
      }));
    }

    // Apply pagination to the course IDs
    const startIndex = page_options_dto.skip;
    const endIndex = startIndex + page_options_dto.take;
    const paginatedCourseIds = courseIds.slice(startIndex, endIndex);
    console.time('Get Student Catalog Courses For Org');
    // Stage 2: Fetch Catalog Courses with Basic Info
    const catalogCourses = await this.repository.query(`
    SELECT
      course.id                   AS course_id,
      course.name                 AS course_name,
      course."createdAt"            AS course_createdAt,
      course.*
    FROM courses course
    WHERE course.id  = ANY($1)
    ORDER BY course."createdAt" ASC;
`, [paginatedCourseIds]) as (Course & {
      course_id: string;
      course_name: string;
      course_createdAt: string; // or Date depending on your DB driver
    })[];
    console.timeEnd('Get Student Catalog Courses For Org');
    console.time('Fetch Course Units and Statistics');
    // Stage 3: Fetch Units for all courses
    const unitsQuery = `
    SELECT cu.*, cucu."coursesId" as "courseId"
    FROM course_units cu
    JOIN courses_units_course_units cucu ON cu.id = cucu."courseUnitsId"
    WHERE cucu."coursesId" IN (${paginatedCourseIds.map((_, i) => `$${i + 1}`).join(', ')})
      AND cu.active = true
    ORDER BY cu.sort ASC
  `;
    const units = await this.courseUnitRepository
      .query(unitsQuery, paginatedCourseIds) as
      (CourseUnit & { courseId: string })[];


    console.timeEnd('Fetch Course Units and Statistics');
    // Create a map of course ID to units
    const courseUnitsMap = new Map<string, (typeof units)>();
    units.forEach((unit) => {
      const courseId = unit.courseId;
      if (!courseUnitsMap.has(courseId)) {
        courseUnitsMap.set(courseId, []);
      }
      courseUnitsMap.get(courseId)?.push(unit);
    });
    console.time('Batch Fetch Statistics');
    // Stage 4: Batch Fetch Statistics
    // 4.1: Total lessons per course
    const unitIds = [...new Set(units.map((u) => u.id))];
    const lessons = await this.repository.query(`
      SELECT DISTINCT ltcu."courseUnitId" as courseUnitId, l.id as lesson_id, lc.id as lesson_content_id
      FROM lessons l
      JOIN lesson_to_course_unit ltcu ON ltcu."lessonId" = l.id
           
      JOIN "lessons-contents" lc ON lc."lessonId" = l.id
      WHERE ltcu."courseUnitId" IN (${unitIds.map((_, i) => `$${i + 1}`).join(', ')})
        AND l.active = true
        AND lc.active = true
    `, unitIds) as {
      courseunitid: string,
      lesson_id: string,
      lesson_content_id: string
    }[];
    const unitLessonMap = new Map();
    const lessonPerUnit = new Map();
    lessons.forEach((lesson) => {
      const unitId = lesson.courseunitid;
      if (!lessonPerUnit.has(unitId)) {
        lessonPerUnit.set(unitId, new Set());
      }
      lessonPerUnit.get(unitId).add(lesson.lesson_id);
    });
    lessonPerUnit.forEach((lessonSet, unitId) => {
      unitLessonMap.set(unitId, lessonSet.size);
    });
    const lessonIds = [...new Set(lessons.map(l => l.lesson_id))];
    const lessonContentIds = [...new Set(lessons.map(l => l.lesson_content_id))];

    const lessonsCount: { courseId: string; totalLessons: number }[] = [];
    for (const courseId of paginatedCourseIds) {
      const courseUnits = courseUnitsMap.get(courseId) || [];
      const totalLessons = courseUnits.reduce((sum: number, unit) => sum + (unitLessonMap.get(unit.id) || 0), 0);
      lessonsCount.push({ courseId, totalLessons });
    }
    // 4.2: Parallel fetch statistics
    const [likesCount, challengesCount, studentProgress, studentRating, studentLike] = await Promise.all(
      [
        this.getRepository()
          .createQueryBuilder('catalog_course')
          .select('course.id as courseId, COUNT(likes.id) as likesCount')
          .leftJoin('catalog_course.course', 'course')
          .leftJoin('course.likes', 'likes')
          .where('catalog_course.course_id IN (:...courseIds)', { courseIds: paginatedCourseIds })
          .groupBy('course.id')
          .getRawMany(),

        (async () => {
          // Build lesson content to course mapping from existing lessons data
          const lessonContentToCourseMap = new Map();
          lessons.forEach((lesson) => {
            const unit = units.find((u) => u.id === lesson.courseunitid);
            if (unit) {
              lessonContentToCourseMap.set(lesson.lesson_content_id, unit.courseId);
            }
          });

          // Simplified query - just get lesson content IDs that have validators
          const challengeContents: { lessonContentId: string }[] = await this.repository.query(`
          SELECT DISTINCT lc.id as "lessonContentId"
          FROM "lessons-contents" lc
          INNER JOIN "lessons-content-validator" v ON v."lessonContentId" = lc.id AND v.regex IS NOT NULL
          WHERE lc."lessonId" IN (${lessonIds.map((_, i) => `$${i + 1}`).join(', ')})
        `, lessonIds);

          // Group and count by courseId using the mapping
          const courseChallengesMap = new Map();
          challengeContents.forEach((item) => {
            const courseId = lessonContentToCourseMap.get(item.lessonContentId);
            if (courseId) {
              courseChallengesMap.set(courseId, (courseChallengesMap.get(courseId) || 0) + 1);
            }
          });

          // Convert to array format matching original query result
          return Array.from(courseChallengesMap.entries()).map(([courseId, count]) => ({
            courseId,
            challengesCount: count
          }));
        })(),

        (async () => { //Student Progress
          const lessonContentToCourseMap = new Map();
          lessons.forEach((lesson) => {
            const unit = units.find((u) => u.id === lesson.courseunitid);
            if (unit) {
              lessonContentToCourseMap.set(lesson.lesson_content_id, unit.courseId);
            }
          });

          // Simplified query - just get completed lesson content IDs
          const completedContents: { lessoncontentid: string }[] = await this.repository.query(`
          SELECT DISTINCT cpcc."lessonsContentsId" as lessoncontentid
          FROM progress_lesson_complete cpcc
          INNER JOIN "course-progress" cp ON cp.id = cpcc."courseProgressId"
          INNER JOIN students s ON s."progressId" = cp.id
          WHERE s.id = $1
          AND cpcc."lessonsContentsId" IN (
            SELECT lc.id FROM "lessons-contents" lc WHERE lc."lessonId" IN (${lessonIds.map((_, i) => `$${i + 2}`).join(', ')})
          )
        `, [student_id, ...lessonIds]);

          // Group and count by courseId using the mapping
          const courseCompletedMap = new Map();
          completedContents.forEach((item) => {
            const courseId = lessonContentToCourseMap.get(item.lessoncontentid);
            if (courseId) {
              courseCompletedMap.set(courseId, (courseCompletedMap.get(courseId) || 0) + 1);
            }
          });

          // Convert to array format matching original query result
          return Array.from(courseCompletedMap.entries()).map(([courseId, count]) => ({
            courseId,
            completedChallenges: count
          }));
        })(),

        this.getRepository()
          .createQueryBuilder('catalog_course')
          .select('course.id as courseId, ratings.rating as rating')
          .leftJoin('catalog_course.course', 'course')
          .leftJoin('course.ratings', 'ratings')
          .leftJoin('ratings.student', 'student')
          .where('student.id = :student_id', { student_id })
          .andWhere('catalog_course.course_id IN (:...courseIds)', { courseIds: paginatedCourseIds })
          .getRawMany(),

        this.getRepository()
          .createQueryBuilder('catalog_course')
          .select('course.id as courseId, likes.liked as liked')
          .leftJoin('catalog_course.course', 'course')
          .leftJoin('course.likes', 'likes')
          .leftJoin('likes.student', 'student')
          .where('student.id = :student_id', { student_id })
          .andWhere('catalog_course.course_id IN (:...courseIds)', { courseIds: paginatedCourseIds })
          .getRawMany(),
      ]);

    console.timeEnd('Batch Fetch Statistics');
    // Stage 5: Data Assembly
    // Create helper functions to find statistics by course ID
    const findLessonsCount = (courseId: string) =>
      lessonsCount.find(item => item.courseId === courseId)?.totalLessons || 0;

    const findLikesCount = (courseId: string) =>
      likesCount.find(item => item.courseId === courseId)?.likesCount || 0;

    const findChallengesCount = (courseId: string) =>
      challengesCount.find((item) => item.courseId === courseId)?.challengesCount || 0;

    const findStudentProgress = (courseId: string) =>
      studentProgress.find((item) => item.courseId === courseId)?.completedChallenges || 0;

    const findStudentRating = (courseId: string) =>
      studentRating.find(item => item.courseId === courseId)?.rating || null;

    const findStudentLike = (courseId: string) =>
      studentLike.find(item => item.courseId === courseId)?.liked || false;

    // Combine all data
    const result = catalogCourses.map(catalogCourse => {

      const courseId = catalogCourse.course_id;

      // Get statistics
      const total_lessons = findLessonsCount(courseId) + '';
      const likes_count = findLikesCount(courseId);
      const chalanges = findChallengesCount(courseId);
      const completed_chalanges = findStudentProgress(courseId);
      const rating = findStudentRating(courseId);
      const liked = findStudentLike(courseId);

      // Calculate progress percentage
      const progress = chalanges > 0
        ? Math.floor((completed_chalanges * 100) / chalanges)
        : 0;

      return {
        ...catalogCourse,
        id: catalogCourse.course_id,
        units: courseUnitsMap.get(courseId) || [],
        total_lessons,
        likes_count,
        completed_chalanges,
        chalanges,
        progress: progress + '',
        rating, my_rating: rating,
        liked,
        certificateId: '',
      } as CourseRaw;
    });

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({
      item_count: courseIds.length,
      page_options_dto,
    });

    return new PageDto(result, pageMetaDto);
  }

  async getOwnCatalogCoursesForOrg(
    page_options_dto: PageOptionsDto,
    org_id: string,
  ): Promise<PageDto<Course>> {
    const query_builder = this.getRepository()
      .createQueryBuilder('catalog_course')
      .leftJoinAndSelect('catalog_course.course', 'course')
      .leftJoin('course.schools', 'school')
      .where('catalog_course.organization_id = :org_id', { org_id })
      .andWhere('school.organizationId = :org_id', { org_id })
      .orderBy('course.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()
    this.logger.debug(`Fetched ${entities.length} entities for own catalog courses`)

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })
    return new PageDto(
      entities.map((e) => e.course),
      page_meta_dto,
    )
  }

  async getGlobalCatalogCoursesForOrg(
    page_options_dto: PageOptionsDto,
    org_id: string,
  ): Promise<PageDto<any>> {
    // any, бо курс буде з додатковим полем
    const query_builder = this.getRepository()
      .createQueryBuilder('catalog_course')
      .leftJoinAndSelect('catalog_course.course', 'course')
      .where('catalog_course.organization_id = :org_id', { org_id })
      .andWhere('course.is_global = :is_global', { is_global: true })
      .orderBy('course.createdAt', Order.ASC)
      .skip(page_options_dto.skip)
      .take(page_options_dto.take)

    const item_count = await query_builder.getCount()
    const { entities } = await query_builder.getRawAndEntities()

    const page_meta_dto = new PageMetaDto({ item_count, page_options_dto })

    return new PageDto(
      entities.map((e) => ({
        ...e.course,
        is_show_in_catalog: e.is_show, // додаємо поле з catalog_course
      })),
      page_meta_dto,
    )
  }

  async addCourseToCatalog(
    org_id: string,
    course_id: string,
    is_show = true,
  ): Promise<CatalogCourse> {
    return await this.repository.save({
      organization_id: org_id,
      course_id,
      is_show: is_show,
    })
  }

  async setGlobalCourseVisibility(
    org_id: string,
    course_id: string,
    is_show: boolean,
  ): Promise<void> {
    const catalog = await this.repository.findOne({
      where: { organization_id: org_id, course_id },
    })
    if (catalog) {
      catalog.is_show = is_show
      await this.repository.save(catalog)

      return
    }
    throw new Error('Catalog entry not found')
  }
  async getCourseIds(org_id: string): Promise<string[]> {
    const courseIdsQuery = `
    WITH OrganizationGetter AS (
      SELECT o.id
      FROM organization o
      JOIN catalog_course cc ON cc.organization_id = o.id
      WHERE cc.is_show = true
      ORDER BY
        CASE
          WHEN o.id = $1 THEN 1                -- 1st Priority: The specific org
          WHEN o.slug = 'codetribe' THEN 2     -- 2nd Priority: The default org
          ELSE 3                               -- 3rd Priority: Oldest org
        END ASC,
        "o"."createdAt" ASC
      LIMIT 1
    )

    SELECT courses.id
    FROM catalog_course
    JOIN courses ON catalog_course.course_id = courses.id
    WHERE catalog_course.organization_id = (SELECT id FROM OrganizationGetter)
      AND catalog_course.is_show = true
      AND courses.public = true
      AND courses.active = true
      AND courses.catalog = true
    ORDER BY courses."createdAt" ASC
  `;

    const courseIds = await this.repository.query(courseIdsQuery, [
      org_id
    ]);
    return courseIds.map((row: { id: string }) => row.id);
  }
}
