import { Injectable } from '@nestjs/common'

import { CodeAssignment } from '../../../modules/core/code-assignment/code-assignment.entity'
import { CodeAssignmentManagerService } from '../../../modules/managers/code-assignment-manager/code-assignment-manager.service'
import { MessageDto } from '../../../utils/dtos/message.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { CodeAssignmentSearchOptions } from './dtos/code-assignment-search-option.dto'
import { CreateCodeAssignmentDto } from './dtos/create-code-assignment.dto'
import { UpdateCodeAssignmentDto } from './dtos/update-code-assignment.dto'

@Injectable()
export class CodeAssignmentManagerApiService {
  constructor(
    private codeAssignmentManagerService: CodeAssignmentManagerService,
  ) {}

  async getCodeAssignmentList(
    dto: CodeAssignmentSearchOptions,
  ): Promise<PageDto<CodeAssignment>> {
    return await this.codeAssignmentManagerService.getList(dto)
  }

  async getCodeAssignment(id: string): Promise<CodeAssignment> {
    return await this.codeAssignmentManagerService.getCodeAssignment(id)
  }

  async createCodeAssignment(
    dto: CreateCodeAssignmentDto,
  ): Promise<CodeAssignment> {
    return await this.codeAssignmentManagerService.create(dto)
  }

  async updateCodeAssignment(
    id: string,
    dto: UpdateCodeAssignmentDto,
  ): Promise<MessageDto> {
    await this.codeAssignmentManagerService.update(id, dto)
    return new MessageDto('Code assignment udpated')
  }

  async removeCodeAssignment(id: string): Promise<MessageDto> {
    await this.codeAssignmentManagerService.remove(id)
    return new MessageDto('Code assignment removed')
  }
}
