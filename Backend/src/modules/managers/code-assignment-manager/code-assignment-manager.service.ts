import { Injectable, NotFoundException } from '@nestjs/common'

import { CodeAssignmentSearchOptions } from '../../../api/manager/code-assignment-manager-api/dtos/code-assignment-search-option.dto'
import { CreateCodeAssignmentDto } from '../../../api/manager/code-assignment-manager-api/dtos/create-code-assignment.dto'
import { UpdateCodeAssignmentDto } from '../../../api/manager/code-assignment-manager-api/dtos/update-code-assignment.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CodeAssignment } from '../../core/code-assignment/code-assignment.entity'
import { CodeAssignmentService } from '../../core/code-assignment/code-assignment.service'

@Injectable()
export class CodeAssignmentManagerService {
  constructor(private codeAssignmentService: CodeAssignmentService) {}

  async getList(
    dto: CodeAssignmentSearchOptions,
  ): Promise<PageDto<CodeAssignment>> {
    return await this.codeAssignmentService.getList(dto)
  }

  async getCodeAssignment(id: string): Promise<CodeAssignment> {
    const unit = await this.codeAssignmentService.findOne({ where: { id } })
    if (!unit) throw new NotFoundException("module doesn't exist")
    return unit
  }

  async create(dto: CreateCodeAssignmentDto): Promise<CodeAssignment> {
    return await this.codeAssignmentService.create(dto)
  }

  async update(id: string, dto: UpdateCodeAssignmentDto): Promise<void> {
    const unit = await this.codeAssignmentService.findOne({ where: { id } })
    if (!unit) throw new NotFoundException("module doesn't exist")
    await this.codeAssignmentService.update(id, dto)
  }

  async remove(id: string): Promise<void> {
    await this.codeAssignmentService.remove(id)
  }
}
