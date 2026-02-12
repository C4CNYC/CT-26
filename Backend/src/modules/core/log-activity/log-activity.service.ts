// activity-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogActivity, LogActivityCategory, LogActivityUserInfo } from './log-activity.entity';

export interface CreateLogActivityDto {
  category: LogActivityCategory;
  action: string;
  user: LogActivityUserInfo;
  status?: string;
  latency?: number;
}

export interface LogActivityFilters {
  category?: LogActivityCategory;
  action?: string;
  userId?: string;
  tenant?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

@Injectable()
export class LogActivityService {
  constructor(
    @InjectRepository(LogActivity)
    private readonly activityLogRepository: Repository<LogActivity>,
  ) {}

  /**
   * Create a new activity log entry
   */
  async create(createDto: CreateLogActivityDto): Promise<LogActivity> {
    const activityLog = this.activityLogRepository.create(createDto);
    return await this.activityLogRepository.save(activityLog);
  }

  async logActivity(
    category: LogActivityCategory,
    action: string,
    user: LogActivityUserInfo,
    status?: string,
    latency?: number,
  ): Promise<LogActivity> {
    return this.create({
      category,
      action,
      user,
      status,
      latency,
    });
  }

  async findAll(filters: LogActivityFilters = {}): Promise<LogActivity[]> {
    const queryBuilder = this.activityLogRepository.createQueryBuilder('log');

    if (filters.category) {
      queryBuilder.andWhere('log.category = :category', { category: filters.category });
    }

    if (filters.action) {
      queryBuilder.andWhere('log.action ILIKE :action', { action: `%${filters.action}%` });
    }

    if (filters.userId) {
      queryBuilder.andWhere("log.user->>'userid' = :userId", { userId: filters.userId });
    }

    if (filters.tenant) {
      queryBuilder.andWhere("log.user->>'tenant' = :tenant", { tenant: filters.tenant });
    }

    if (filters.status) {
      queryBuilder.andWhere('log.status = :status', { status: filters.status });
    }

    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    queryBuilder.orderBy('log.createdAt', 'DESC');

    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }

    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    return queryBuilder.getMany();
  }

  async findByUserId(userId: string, limit = 50): Promise<LogActivity[]> {
    return this.activityLogRepository
      .createQueryBuilder('log')
      .where("log.user->>'userid' = :userId", { userId })
      .orderBy('log.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findByTenant(tenant: string, limit = 100): Promise<LogActivity[]> {
    return this.activityLogRepository
      .createQueryBuilder('log')
      .where("log.user->>'tenant' = :tenant", { tenant })
      .orderBy('log.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getActivityStats(startDate: Date, endDate: Date): Promise<any> {
    const result = await this.activityLogRepository
      .createQueryBuilder('log')
      .select('log.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(log.latency)', 'avgLatency')
      .where('log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('log.category')
      .getRawMany();

    return result;
  }

  async deleteOldLogs(olderThanDays: number): Promise<{ affected: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.activityLogRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    return { affected: result.affected || 0 };
  }

  async findOne(id: string): Promise<LogActivity | null> {
    return this.activityLogRepository.findOne({ where: { id } });
  }

  async count(filters: Partial<LogActivityFilters> = {}): Promise<number> {
    const queryBuilder = this.activityLogRepository.createQueryBuilder('log');

    if (filters.category) {
      queryBuilder.andWhere('log.category = :category', { category: filters.category });
    }

    if (filters.userId) {
      queryBuilder.andWhere("log.user->>'userid' = :userId", { userId: filters.userId });
    }

    if (filters.tenant) {
      queryBuilder.andWhere("log.user->>'tenant' = :tenant", { tenant: filters.tenant });
    }

    return queryBuilder.getCount();
  }
}
