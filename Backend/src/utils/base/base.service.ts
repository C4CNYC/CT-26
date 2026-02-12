/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm'

export class BaseService<T extends ObjectLiteral> {
  protected entity: EntityTarget<T>
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public repository: Repository<T>

  constructor(entity: EntityTarget<T>, repository: Repository<T>) {
    this.entity = entity
    this.repository = repository
  }

  public async create(
    data: DeepPartial<T>,
    entity_manager?: EntityManager,
  ): Promise<T> {
    const repository = this.getRepository(entity_manager)
    return await repository.save(data)
  }

  public async findOne(
    filters: FindOneOptions<T>,
    entity_manager?: EntityManager,
  ): Promise<T> {
    const repository = this.getRepository(entity_manager)
    return (await repository.findOne(filters)) as T
  }

  public async find(
    filters: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations?: FindOptionsRelations<T>,
    entity_manager?: EntityManager,
    order?: FindOptionsOrder<T>,
  ): Promise<T[]> {
    const repository = this.getRepository(entity_manager)
    return await repository.find({ where: filters, relations, order })
  }

  public async update(
    id: string | string[] | FindOptionsWhere<T>,
    data: DeepPartial<any>,
    entity_manager?: EntityManager,
  ): Promise<UpdateResult> {
    const repository = this.getRepository(entity_manager)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await repository.update(id, data)
  }

  public async remove(
    id: string,
    entity_manager?: EntityManager,
  ): Promise<DeleteResult> {
    const repository = this.getRepository(entity_manager)
    return await repository.delete(id)
  }

  protected getRepository(entity_manager?: EntityManager): Repository<T> {
    return entity_manager
      ? entity_manager.getRepository(this.entity)
      : this.repository
  }
}
