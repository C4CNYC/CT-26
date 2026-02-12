import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsRelations, IsNull } from 'typeorm'

import { CreateMediaDto } from '../../../api/manager/media-manager-api/dtos/create-media.dto'
import { MediaSearchOptions } from '../../../api/manager/media-manager-api/dtos/media-search-option.dto'
import { UpdateMediaDto } from '../../../api/manager/media-manager-api/dtos/update-media.dto'
import { PageDto } from '../../../utils/dtos/page.dto'
import { Media } from '../../core/media/media.entity'
import { MediaService } from '../../core/media/media.service'
import { SchoolService } from '../../core/school/school.service'
import { UserService } from '../../core/user/user.service'

@Injectable()
export class MediaManagerService {
  constructor(
    private mediaService: MediaService,
    private userService: UserService,
    private schoolService: SchoolService,
  ) {}

  async getList(
    dto: MediaSearchOptions,
    userId: string,
  ): Promise<PageDto<Media>> {
    const {
      data: [school],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } = await this.schoolService.findByTeacher({ skip: 0 }, userId)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return await this.mediaService.getList(dto, userId, school?.id)
  }

  async getMedia(
    id: string,
    userId: string,
    relations?: FindOptionsRelations<Media>,
  ): Promise<Media> {
    const {
      data: [school],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } = await this.schoolService.findByTeacher({ skip: 0 }, userId)
    const media = await this.mediaService.findOne({
      where: [
        { id, userId, schoolId: school.id },
        { id, userId: IsNull() },
      ],
      relations,
    })
    if (!media) throw new NotFoundException("media doesn't exist")
    return media
  }

  async updatePath(path: string, newPath: string): Promise<void> {
    await this.mediaService.updateMediaPath(path, newPath)
  }

  async create(dto: CreateMediaDto & { userId: string }): Promise<Media> {
    const user = await this.userService.findOne({ where: { id: dto.userId } })
    const {
      data: [school],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
    } = await this.schoolService.findByTeacher({ skip: 0 }, dto.userId)
    return await this.mediaService.create({
      ...dto,
      user,
      school,
    })
  }

  async update(id: string, dto: UpdateMediaDto): Promise<void> {
    const media = await this.mediaService.findOne({ where: { id } })
    if (!media) throw new NotFoundException("media doesn't exist")
    await this.mediaService.update(id, dto)
  }

  async remove(id: string): Promise<void> {
    await this.mediaService.remove(id)
  }
}
