import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { classroom_v1 } from 'googleapis'

import invitesConfig from '@/config/invites.config'
import { AuthPasswordsService } from '@/old-auth/auth-password.service'

import { CreateStudentDto } from '../../../api/manager/school-student-manager-api/dtos/create-student.dto'
import { InviteStudentDto } from '../../../api/manager/school-student-manager-api/dtos/invite-student.dto'
import { SchoolSearchOptions } from '../../../api/manager/school-student-manager-api/dtos/school-search-options.dto'
import { UpdateStudentDto } from '../../../api/manager/school-student-manager-api/dtos/update-student.dto'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Class } from '../../core/class/class.entity'
import { ClassService } from '../../core/class/class.service'
import { School } from '../../core/school/school.entity'
import { SchoolService } from '../../core/school/school.service'
import { Student } from '../../core/student/student.entity'
import { StudentService } from '../../core/student/student.service'
import { Role } from '../../core/user/enums/role.enum'
import { UserService } from '../../core/user/user.service'
import { InvitationsManagerService } from '../invitations-manager/invitations-manager.service'
import { SchoolAccessManagerService } from '../school-access-manager/school-access-manager.service'
import { StudentManagerService } from '../student-manager/student-manager.service'
import { ApplicationEventEnum as Event } from '../users-manager/enums/application-event'
import { ApplicationEventEnum } from '../users-manager/enums/application-event'
import { UsersManagerService } from '../users-manager/users-managers.service'

import _ = require('lodash')

@Injectable()
export class SchoolStudentsManagerService {
  private readonly logger = new Logger(SchoolStudentsManagerService.name)
  private readonly iConfig: ConfigType<typeof invitesConfig>

  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    private classService: ClassService,
    private schoolService: SchoolService,
    private studentService: StudentService,
    private userManagerService: UsersManagerService,
    private authPasswordService: AuthPasswordsService,
    private studentManagerService: StudentManagerService,
    private inviteManagerService: InvitationsManagerService,
    private schoolAccessManagerService: SchoolAccessManagerService,
    @Inject(invitesConfig.KEY)
    iConfig: ConfigType<typeof invitesConfig>,
  ) {
    this.iConfig = iConfig
  }

  getInvitationExpiredDate(): string {
    return new Date(
      Date.now() + +this.iConfig.inviteStudentTtl * 1000,
    ).toISOString()
  }

  async inviteStudent(
    school_id: string,
    { class_id, ...dto }: InviteStudentDto,
    tenant: string,
  ): Promise<void> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
    })

    if (!school) {
      throw new NotFoundException("school doesn't exist")
    }

    const schoolClass = class_id
      ? await this.classService.findOne({
          where: { id: class_id },
          relations: { students: true },
        })
      : null

    const existedUser = await this.userService.findOne({
      where: { email: dto.email },
      relations: { student_profile: true },
    })

    if (existedUser) {
      const existStudent = await this.studentService.findOne({
        where: { id: existedUser.student_profile.id },
        relations: { school: true },
      })
      existStudent.school = [school]
      await this.studentService.repository.save(existStudent)
    }

    const user = await this.userManagerService.createUserWithoutPassword({
      ...dto,
      role: Role.Student,
      first_name: dto.email,
      last_name: '',
      verified: true,
      active: true,
    })

    if (schoolClass) {
      schoolClass?.students.push(
        existedUser?.student_profile || user?.student_profile,
      )
      await this.classService.repository.save(schoolClass)
    }
    const invite = await this.inviteManagerService.createInvitation(user)

    this.eventEmitter.emit(Event.INVITE_USER, user.email, invite.id, tenant)
  }

  async getStudent(id: string): Promise<Student> {
    const student = await this.studentService.findOne({
      where: { id },
      relations: { socials: true, account: true },
    })
    if (!student) throw new NotFoundException(`user doesn't exist`)
    return student
  }

  async getStudentsBySchool(
    school_id: string,
    dto: SchoolSearchOptions,
  ): Promise<PageDto<Student>> {
    return await this.studentService.getBySchool(school_id, dto)
  }

  async resetStudentPassword(
    student_id: string,
    password: string,
  ): Promise<boolean> {
    const student = await this.studentManagerService.getStudent(student_id)

    if (student && student.account) {
      const user = await this.userService.findOne({
        where: { id: student.account.id },
      })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      await this.userService.update(user.id, {
        password: await this.authPasswordService.getHashedPassword(password),
      })

      return true
    }

    return false
  }

  async createStudent(
    school_id: string,
    { password: unprotectedPassword, ...dto }: CreateStudentDto,
    tenant_name: string,
  ): Promise<Student> {
    const school = await this.schoolService.findOne({
      where: { id: school_id },
      relations: { students: true },
    })

    if (!school) throw new NotFoundException(`school doesn't exist`)

    const userExist = await this.userService.findOne({
      where: { email: dto.email },
    })

    if (userExist) throw new ConflictException('user already exist')

    const student_profile = await this.studentService.create(
      _.omit(dto, ['password', 'email']),
    )

    const user = await this.userService.create({
      ..._.pick(dto, ['email', 'first_name', 'last_name']),
      role: Role.Student,
      student_profile,
      password:
        await this.authPasswordService.getHashedPassword(unprotectedPassword),
    })

    school.students.push(user.student_profile)

    await this.schoolService.repository.save(school)
    this.eventEmitter.emit(
      ApplicationEventEnum.INVITE_STUDENT,
      user.email,
      unprotectedPassword,
      school.name,
      tenant_name,
    )
    return user.student_profile
  }

  async createStudentsFromGoogleClassesList(
    school_id: string,
    students: classroom_v1.Schema$Student[],
    tenant: string,
    batch_size = 100,
  ): Promise<Student[]> {
    try {
      const school = await this.schoolService.findOne({
        where: { id: school_id },
        relations: { students: true },
      })

      if (!school) throw new NotFoundException(`School ${school_id} not found`)

      const new_students: Student[] = []

      // Process students in batches to avoid overwhelming the system
      for (let i = 0; i < students.length; i += batch_size) {
        const chunk = students.slice(i, i + batch_size)

        const processed = await Promise.all(
          chunk.map(async (student) => {
            const email = student.profile?.emailAddress
            if (!email) return null

            let user = await this.userService.findOne({
              where: { email },
              relations: { student_profile: true },
            })

            if (!user) {
              user = await this.userManagerService.createUserWithoutPassword({
                email,
                role: Role.Student,
                first_name: student.profile?.name?.givenName ?? undefined,
                last_name: student.profile?.name?.familyName ?? undefined,
                verified: true,
                active: true,
              })

              const invite =
                await this.inviteManagerService.createInvitation(user)

              this.eventEmitter.emit(
                Event.INVITE_USER,
                user.email,
                invite.id,
                tenant,
              )

              this.logger.log(`Created new user and invitation for ${email}`)
            } else {
              this.logger.debug(`User already exists: ${email}`)
            }

            return user.student_profile
          }),
        )

        new_students.push(...(processed.filter(Boolean) as Student[]))
      }

      school.students = [...school.students, ...new_students]
      await this.schoolService.repository.save(school)

      return new_students
    } catch (error) {
      this.logger.error(
        `Failed to create students from Google list for school=${school_id}`,
        'createStudentsFromGoogleClassesList',
      )
      throw error instanceof Error ? error : new InternalServerErrorException()
    }
  }

  async updateStudent(
    student_id: string,
    dto: UpdateStudentDto,
  ): Promise<void> {
    const student = await this.studentService.findOne({
      where: { id: student_id },
    })

    if (!student) throw new NotFoundException(`student doesn't exist`)

    await this.studentService.update(student_id, dto)
  }

  // Removes the student from this school, and deletes the account only when nothing else ties it to the platform
  async deleteStudent(
    school_id: string,
    student_id: string,
    user_id: string,
  ): Promise<MessageDto> {
    if (
      !(await this.schoolAccessManagerService.canUserManageSchool(
        user_id,
        school_id,
      ))
    ) {
      throw new NotFoundException("student isn't in this school")
    }

    const student = await this.studentService.findOne({
      where: { id: student_id, school: { id: school_id } },
      relations: { account: { organization_owner: true } },
    })
    if (!student) throw new NotFoundException("student isn't in this school")

    return await this.studentService.repository.manager.transaction(
      async (manager) => {
        const schoolClasses = await manager.find(Class, {
          where: { school: { id: school_id }, students: { id: student_id } },
          select: ['id'],
        })
        await manager
          .createQueryBuilder()
          .relation(Student, 'classes')
          .of(student_id)
          .remove(schoolClasses)
        await manager
          .createQueryBuilder()
          .relation(Student, 'school')
          .of(student_id)
          .remove(school_id)

        const otherSchools = await manager.count(School, {
          where: { students: { id: student_id } },
        })
        const { account } = student
        const belongsElsewhere =
          otherSchools > 0 ||
          (account &&
            (account.role !== Role.Student ||
              Boolean(account.organization_owner)))
        if (belongsElsewhere) {
          return new MessageDto('student removed from school')
        }

        // The account and the student's history go with it (ON DELETE CASCADE)
        await manager.delete(Student, student_id)
        return new MessageDto('student deleted')
      },
    )
  }
}
