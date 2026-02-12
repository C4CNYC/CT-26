import { PageMetaDtoParameters } from '../interfaces/page-meta-dto-parameters.interface'

export class PageMetaDto {
  readonly page: number

  readonly take: number

  readonly itemCount: number

  readonly pageCount: number

  readonly hasPreviousPage: boolean

  readonly hasNextPage: boolean

  constructor({ page_options_dto, item_count }: PageMetaDtoParameters) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.page = page_options_dto.page
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.take = page_options_dto.take
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.itemCount = item_count
    this.pageCount = Math.ceil(this.itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}
