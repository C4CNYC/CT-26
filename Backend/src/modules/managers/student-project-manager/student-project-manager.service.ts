import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { CreateProjectDto } from '../../../api/student/student-project-api/dtos/create-project.dto'
import { MyPublicProjectSearchOptions } from '../../../api/student/student-project-api/dtos/public-project-search.dto'
import { MyProjectSearchOptions } from '../../../api/student/student-project-api/dtos/search-project.dto'
import { UpdateProjectDto } from '../../../api/student/student-project-api/dtos/update-project.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { StudentProject } from '../../core/student-project/student-project.entity'
import { StudentProjectService } from '../../core/student-project/student-project.service'

@Injectable()
export class StudentProjectManagerService {
  constructor(private studentProjectService: StudentProjectService) {}

  async getPublicProjcetList(
    dot: MyPublicProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
    return await this.studentProjectService.getPublicProjects(dot)
  }

  async checkPermission(id: string, student_id?: string): Promise<void> {
    const project = await this.studentProjectService.findOne({
      where: { id },
      relations: { student: true },
    })
    if (!project) throw new NotFoundException("project doesn't exist")
    if (project.public) return
    if (project.student.id !== student_id)
      throw new ForbiddenException("student don't have access to this project")
  }

  async getProjcetList(
    student_id: string,
    dto: MyProjectSearchOptions,
  ): Promise<PageDto<StudentProject>> {
    return await this.studentProjectService.getByStudent(student_id, dto)
  }

  async getProject(id: string, student_id?: string): Promise<StudentProject> {
    await this.checkPermission(id, student_id)
    const project = await this.studentProjectService.findOne({ where: { id } })
    if (!project) throw new NotFoundException("project doesn't exist")
    return project
  }

  async create(dto: CreateProjectDto): Promise<StudentProject> {
    return await this.studentProjectService.create(dto)
  }

  async update(
    id: string,
    student_id: string,
    dto: UpdateProjectDto | { cover: string } | { avatar: string },
  ): Promise<void> {
    await this.getProject(id, student_id)
    await this.studentProjectService.update(id, dto)
  }

  async remove(id: string, student_id: string): Promise<void> {
    await this.getProject(id, student_id)
    await this.studentProjectService.remove(id)
  }
}
