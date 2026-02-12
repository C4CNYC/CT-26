import { Injectable, NotFoundException } from '@nestjs/common'

import { ClassService } from '@/modules/core/class/class.service'
import { UserActivityService } from '@/modules/core/user-activity/user-activity.service'
import { UserService } from '@/modules/core/user/user.service'
import { MessageDto } from '@/utils/dtos/message.dto'

@Injectable()
export class ActivityManagerService {
  constructor(
    private activityService: UserActivityService,
    private userService: UserService,
    private classService: ClassService,
  ) {}

  async setActiveClass(class_id: string, user_id: string): Promise<MessageDto> {
    const user = await this.userService.findOne({
      where: { id: user_id },
      relations: ['activity'],
    })
    const tribe = await this.classService.findOne({ where: { id: class_id } })

    if (!tribe) {
      throw new NotFoundException('Class not found')
    }

    if (!user.activity) {
      const activity = await this.activityService.create({
        user,
        lastActiveTribe: tribe,
      })
      await this.userService.update(user.id, { activity })
      return new MessageDto('Class set successfully')
    }

    await this.activityService.update(user.activity.id, {
      lastActiveTribe: tribe,
    })

    return new MessageDto('Class set successfully')
  }

  async setLastWorkspaceQuery(
    user_id: string,
    query: string,
  ): Promise<MessageDto> {
    const user = await this.userService.findOne({
      where: { id: user_id },
      relations: ['activity'],
    })

    if (!user.activity) {
      const activity = await this.activityService.create({
        user,
        lastWorkspaceQuery: query,
      })
      await this.userService.update(user.id, { activity })
      return new MessageDto('Query set successfully')
    }

    await this.activityService.update(user.activity.id, {
      lastWorkspaceQuery: query,
    })

    return new MessageDto('Query set successfully')
  }

  async getLastWorkspaceQuery(
    user_id: string,
  ): Promise<{ lastWorkspaceQuery: string | null }> {
    let lastWorkspaceQuery = null

    const user = await this.userService.findOne({
      where: { id: user_id },
      relations: ['activity'],
    })

    if (user.activity) {
      lastWorkspaceQuery =
        (
          await this.activityService.findOne({
            where: { id: user.activity.id },
            relations: ['lastActiveTribe'],
          })
        )?.lastWorkspaceQuery || null
    }

    return { lastWorkspaceQuery }
  }

  async getLastActiveClassId(
    user_id: string,
  ): Promise<{ lastActiveTribe: string | null }> {
    let lastActiveTribe = null

    const user = await this.userService.findOne({
      where: { id: user_id },
      relations: ['activity'],
    })

    if (user.activity) {
      lastActiveTribe =
        (
          await this.activityService.findOne({
            where: { id: user.activity.id },
            relations: ['lastActiveTribe'],
          })
        )?.lastActiveTribe?.id || null
    }

    return { lastActiveTribe }
  }
}
