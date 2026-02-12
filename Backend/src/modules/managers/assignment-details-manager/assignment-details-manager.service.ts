import { Injectable, NotFoundException } from '@nestjs/common'

import { AssignClassDto } from '../../../api/manager/school-assigment-manager-api/dtos/assign-class.dto'
import { AssignCourseDto } from '../../../api/manager/school-assigment-manager-api/dtos/assign-course.dto'
import { AssignLessonDto } from '../../../api/manager/school-assigment-manager-api/dtos/assign-lesson.dto'
import { AssignSkillDto } from '../../../api/manager/school-assigment-manager-api/dtos/assign-skill.dto'
import { AssignStudentDto } from '../../../api/manager/school-assigment-manager-api/dtos/assign-student.dto'
import { AssignTaskDto } from '../../../api/manager/school-assigment-manager-api/dtos/assign-task.dto'
import { UnassignSkillDto } from '../../../api/manager/school-assigment-manager-api/dtos/unassign-skill.dto'
import { UnassignClassDto } from '../../../api/manager/school-assigment-manager-api/dtos/unassigne-class.dto'
import { UnassignStudentDto } from '../../../api/manager/school-assigment-manager-api/dtos/unassigne-student.dto'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { AssigmentService } from '../../core/assigment/assigment.service'
import { ClassService } from '../../core/class/class.service'
import { CodeAssignmentService } from '../../core/code-assignment/code-assignment.service'
import { CourseService } from '../../core/course/course.service'
import { LessonService } from '../../core/lesson/lesson.service'
import { SkillService } from '../../core/skills/skill.service'
import { StudentService } from '../../core/student/student.service'

@Injectable()
export class AssignmentDetailsManagerService {
  constructor(
    private codeAssignmentService: CodeAssignmentService,
    private assignmentService: AssigmentService,
    private skillService: SkillService,
    private courseService: CourseService,
    private studentService: StudentService,
    private lessonService: LessonService,
    private classService: ClassService,
  ) {}

  async assignLesson(id: string, dto: AssignLessonDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { lesson: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")
    const lesson = await this.lessonService.findOne({
      where: { id: dto.lesson_id },
    })
    if (!lesson) throw new NotFoundException("lesson doesn't exist")

    await this.assignmentService.update(id, { lesson })
    return new MessageDto('lesson assigned')
  }

  async assignTask(id: string, dto: AssignTaskDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { lesson: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")
    const code_assignment = await this.codeAssignmentService.findOne({
      where: { id: dto.task_id },
    })
    if (!code_assignment) throw new NotFoundException("task doesn't exist")

    await this.assignmentService.update(id, { code_assignment })
    return new MessageDto('task assigned')
  }

  async assignClass(id: string, dto: AssignClassDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { assignee_classes: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")
    const school_class = await this.classService.findOne({
      where: { id: dto.class_id },
    })
    if (!school_class) throw new NotFoundException("class doesn't exist")
    assignment.assignee_classes.push(school_class)
    await this.assignmentService.repository.save(assignment)

    return new MessageDto('class assigned')
  }

  async unassigneClass(id: string, dto: UnassignClassDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { assignee_classes: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")

    assignment.assignee_classes = assignment.assignee_classes.filter(
      (a) => a.id !== dto.class_id,
    )
    await this.assignmentService.repository.save(assignment)

    return new MessageDto('class unassigned')
  }

  async assignStudent(id: string, dto: AssignStudentDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { assignee_students: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")
    const student = await this.studentService.findOne({
      where: { id: dto.student_id },
    })
    if (!student) throw new NotFoundException("student doesn't exist")
    assignment.assignee_students.push(student)
    await this.assignmentService.repository.save(assignment)

    return new MessageDto('student assigned')
  }

  async unassignStudent(
    id: string,
    dto: UnassignStudentDto,
  ): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { assignee_students: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")

    assignment.assignee_students = assignment.assignee_students.filter(
      (a) => a.id !== dto.student_id,
    )
    await this.assignmentService.repository.save(assignment)

    return new MessageDto('student unassigned')
  }

  async assignCourse(id: string, dto: AssignCourseDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { course: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")
    const course = await this.courseService.findOne({
      where: { id: dto.course_id },
    })
    await this.assignmentService.update(assignment.id, { course })

    return new MessageDto('course assigned')
  }

  async unassignCourse(id: string): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { course: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")
    await this.assignmentService.update(assignment.id, { course: null })

    return new MessageDto('course unassigned')
  }

  async assignSkill(id: string, dto: AssignSkillDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { skill_tags: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")
    const skill = await this.skillService.findOne({
      where: { id: dto.skill_id },
    })
    if (!skill) throw new NotFoundException("skill doesn't exist")
    assignment.skill_tags.push(skill)
    await this.assignmentService.repository.save(assignment)

    return new MessageDto('skill assigned')
  }

  async unassignSkill(id: string, dto: UnassignSkillDto): Promise<MessageDto> {
    const assignment = await this.assignmentService.findOne({
      where: { id },
      relations: { skill_tags: true },
    })
    if (!assignment) throw new NotFoundException("assignment doesn't exist")

    assignment.skill_tags = assignment.skill_tags.filter(
      (a) => a.id !== dto.skill_id,
    )
    await this.assignmentService.repository.save(assignment)

    return new MessageDto('skill unassigned')
  }
}
