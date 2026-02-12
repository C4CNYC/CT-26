import { Injectable, NotFoundException } from '@nestjs/common'
import ShortUniqueId from 'short-unique-id'
import { FindOptionsRelations } from 'typeorm'

import { AddCourseToClassDto } from '../../../api/manager/school-class-manager-api/dtos/add-course-to-class.dto'
import { ClassSearchOptions } from '../../../api/manager/school-class-manager-api/dtos/class-search-option.dto'
import { CreateClassDto } from '../../../api/manager/school-class-manager-api/dtos/create-class.dto'
import { UpdateClassSettingDto } from '../../../api/manager/school-class-manager-api/dtos/update-class-setting.dto'
import { UpdateClassDto } from '../../../api/manager/school-class-manager-api/dtos/update-class.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { ClassSettingService } from '../../core/class-setting/class-setting.service'
import { Class } from '../../core/class/class.entity'
import { ClassService } from '../../core/class/class.service'
import { SchoolService } from '../../core/school/school.service'
import { CourseManagerService } from '../course-manager/course-manager.service'

const uid = new ShortUniqueId({ length: 10 })

@Injectable()
export class SchoolClassManagerService {
  constructor(
    private schoolService: SchoolService,
    private courseManagerService: CourseManagerService,
    private classSetting: ClassSettingService,
    private classService: ClassService,
  ) {}

  async getClasses(
    school_id: string,
    dto: PageOptionsDto & ClassSearchOptions,
  ): Promise<PageDto<Class>> {
    return await this.classService.getBySchool(school_id, dto)
  }

  async getClassPreview(share_token: string): Promise<Class> {
    const schoolSetting = await this.classSetting.findOne({
      where: { share_token },
      relations: { class: true },
    })

    if (!schoolSetting) throw new NotFoundException("class doesn't exist")
    return schoolSetting.class
  }

  async getClass(
    class_id: string,
    relations?: FindOptionsRelations<Class>,
  ): Promise<Class> {
    const schoolClass = await this.classService.findOne({
      where: { id: class_id },
      relations,
    })

    if (!schoolClass) throw new NotFoundException("class doesn't exist")
    return schoolClass
  }

  async getClassByShareToken(share_token: string): Promise<Class> {
    const classSetting = await this.classSetting.findOne({
      where: { share_token },
      relations: {
        class: true,
      },
    })

    if (!classSetting) throw new NotFoundException("class doesn't exist")
    return await this.classService.getClass(classSetting.class.id)
  }

  async createClass(school_id: string, dto: CreateClassDto): Promise<Class> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: { classes: true },
    })
    if (!school) throw new NotFoundException(`school doesn't exist`)

    const setting = await this.classSetting.create({
      share_token: uid() as string,
    })
    const schoolClass = await this.classService.create({
      ...dto,
      setting,
    })
    school.classes.push(schoolClass)
    await this.schoolService.repository.save(school)
    return schoolClass
  }

  async updateClass(
    class_id: string,
    dto: UpdateClassDto | { avatar: string },
  ): Promise<void> {
    await this.classService.update(class_id, dto)
  }

  async updateClassSetting(class_id: string, dto: UpdateClassSettingDto) {
    const setting = await this.classSetting.findOne({
      where: { class: { id: class_id } },
    })
    if (!setting) throw new NotFoundException("class doesn't exist")

    await this.classSetting.update(setting.id, dto)
  }

  async removeClass(class_id: string): Promise<void> {
    const schoolClass = await this.classService.findOne({
      where: { id: class_id },
      relations: { students: true },
    })
    schoolClass.students = []
    await this.classService.repository.save(schoolClass)
    await this.classService.remove(class_id)
  }

  async addCourse(id: string, dto: AddCourseToClassDto): Promise<void> {
    const schoolClass = await this.getClass(id, { courses: true })
    const course = await this.courseManagerService.getCourse(dto.course_id)

    schoolClass.courses.push(course)
    await this.classService.repository.save(schoolClass)
  }
  async removeCourse(id: string, dto: AddCourseToClassDto): Promise<void> {
    const schoolClass = await this.getClass(id, { courses: true })

    schoolClass.courses = schoolClass.courses.filter(
      (c) => c.id !== dto.course_id,
    )
    await this.classService.repository.save(schoolClass)
  }
}
