import { Injectable, NotFoundException } from '@nestjs/common'
import ShortUniqueId from 'short-unique-id'

import { OrganizationService } from '@/modules/core/organization/organization.service'

import { AddTeacherDto } from '../../../api/admin/school-api/dtos/add-teacher.dto'
import { CreateClassDto } from '../../../api/admin/school-api/dtos/create-class.dto'
import { CreateSchoolDto } from '../../../api/admin/school-api/dtos/create-school.dto'
import { RemoveTeacherDto } from '../../../api/admin/school-api/dtos/remove-teacher.dto'
import { SchoolOptionDto } from '../../../api/admin/school-api/dtos/school-option.dto'
import { SearchSchoolPageOption } from '../../../api/manager/school-manager-api/dtos/search-school-page-option.dto'
import { UpdateSchoolContactDto } from '../../../api/manager/school-manager-api/dtos/update-school-contact.dto'
import { UpdateSchoolSettingDto } from '../../../api/manager/school-manager-api/dtos/update-school-setting.dto'
import { UpdateSchoolDto } from '../../../api/manager/school-manager-api/dtos/update-school.dto'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageOptionsDto } from '../../../utils/dtos/page-option.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { SchoolStatistic } from '../../../utils/interfaces/school-statistic.dto'
import { ClassSettingService } from '../../core/class-setting/class-setting.service'
import { Class } from '../../core/class/class.entity'
import { ClassService } from '../../core/class/class.service'
import { SchoolContact } from '../../core/school-contact/school-contact.entity'
import { SchoolContactService } from '../../core/school-contact/school-contact.service'
import { SchoolSetting } from '../../core/school-setting/school-setting.entity'
import { SchoolSettingService } from '../../core/school-setting/school-setting.service'
import { School } from '../../core/school/school.entity'
import { SchoolService } from '../../core/school/school.service'
import { Role } from '../../core/user/enums/role.enum'
import { User } from '../../core/user/user.entity'
import { UserService } from '../../core/user/user.service'

const uid = new ShortUniqueId({ length: 10 })

@Injectable()
export class SchoolMangerService {
  constructor(
    private schoolService: SchoolService,
    private classService: ClassService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private classSettingService: ClassSettingService,
    private schoolContactService: SchoolContactService,
    private schoolSettingService: SchoolSettingService,
  ) {}

  async create(dto: CreateSchoolDto, org_id: string): Promise<School> {
    const contact = await this.schoolContactService.create({})
    const setting = await this.schoolSettingService.create({})
    const organization = await this.organizationService.findOne({
      where: { id: org_id },
    })
    return await this.schoolService.create({
      ...dto,
      contact,
      setting,
      organization,
    })
  }

  async createClass(dto: CreateClassDto, school: School): Promise<Class> {
    const setting = await this.classSettingService.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      share_token: uid(),
    })
    return await this.classService.create({ ...dto, school, setting })
  }

  async getSchools(pageOptionDto: SchoolOptionDto): Promise<PageDto<School>> {
    return await this.schoolService.getSchools(pageOptionDto)
  }

  async archiveSchool(school_id: string): Promise<MessageDto> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
    })
    await this.schoolService.update(school_id, { ...school, active: false })
    return new MessageDto('school archived')
  }

  async updateOrgIdForSchool(
    user_id: string,
    organization_id: string,
  ): Promise<MessageDto> {
    const user = await this.userService.findOne({
      where: { id: user_id },
      relations: { schools: true },
    })
    if (!user) throw new NotFoundException("User doesn't exist")
    if (!user.schools.length)
      throw new NotFoundException("Any school doesn't exist")

    const school_id = user.schools[0].id

    const organization = await this.organizationService.findOne({
      where: { id: organization_id },
    })

    if (!organization) throw new NotFoundException("organization doesn't exist")

    await this.schoolService.update(school_id, { organization })
    return new MessageDto('organization updated')
  }

  async getTeachers(
    school_id: string,
    pageOptionDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.userService.getBySchool(pageOptionDto, school_id)
  }

  async getSchool(school_id: string): Promise<School & SchoolStatistic> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: {
        socials: true,
        contact: true,
      },
    })
    if (!school) throw new NotFoundException(`school doesn't exist`)
    const teacher_count = await this.schoolService.getTeachersCount(school_id)
    const student_count = await this.schoolService.getStudentsCount(school_id)
    return {
      ...school,
      teacher_count,
      student_count,
    }
  }

  async getMySchools(
    dto: SearchSchoolPageOption,
    user_id: string,
    org_id: string,
  ): Promise<PageDto<School>> {
    const user = await this.userService.findOne({ where: { id: user_id } })

    switch (user.role) {
      case Role.SuperAdmin:
      case Role.Admin:
      case Role.Owner:
        return await this.getSchools({
          org_id: org_id,
          ...dto,
        } as SchoolOptionDto)
      default:
        return await this.schoolService.findByTeacher(dto, user_id)
    }
  }

  async getContact(school_id: string): Promise<SchoolContact> {
    return await this.schoolContactService.findOne({
      where: {
        school: { id: school_id },
      },
    })
  }

  async getSetting(school_id: string): Promise<SchoolSetting> {
    return await this.schoolSettingService.findOne({
      where: {
        school: { id: school_id },
      },
    })
  }

  async updateSchool(
    school_id: string,
    dto: UpdateSchoolDto,
  ): Promise<MessageDto> {
    await this.schoolService.update(school_id, dto)
    return new MessageDto('school updated')
  }

  async updateContact(
    school_id: string,
    dto: UpdateSchoolContactDto,
  ): Promise<MessageDto> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: { contact: true },
    })
    await this.schoolContactService.update(school.contact.id, dto)
    return new MessageDto('contacts udpated')
  }
  async updateSetting(
    school_id: string,
    dto: UpdateSchoolSettingDto,
  ): Promise<MessageDto> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: { setting: true },
    })
    await this.schoolSettingService.update(school.setting.id, dto)
    return new MessageDto('settings udpated')
  }

  async addTeacher(id: string, dto: AddTeacherDto): Promise<MessageDto> {
    const school = await this.schoolService.findOne({
      where: { id },
    })
    const user = await this.userService.findOne({
      where: { id: dto.user_id },
      relations: { schools: true },
    })
    if (!school) throw new NotFoundException("school doesn't exist")
    if (!user) throw new NotFoundException("use doesn't exist")
    user.schools.push(school)
    await this.userService.repository.save(user)
    return new MessageDto('teacher added')
  }

  async removeTeacher(
    school_id: string,
    dto: RemoveTeacherDto,
  ): Promise<MessageDto> {
    const user = await this.userService.findOne({
      where: { id: dto.user_id },
      relations: { schools: true },
    })
    if (!user) throw new NotFoundException("user doesn't exist")
    user.schools = user.schools.filter((s) => s.id !== school_id)
    await this.userService.repository.save(user)
    return new MessageDto('teacher removed')
  }
}
