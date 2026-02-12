import { User } from '@/modules/core/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisteredStats } from './stats.types';
import { Lesson } from '@/modules/core/lesson/lesson.entity';
import { CourseProgress } from '@/modules/core/course-progress/course-progress.entity';
import { LogActivity } from '@/modules/core/log-activity/log-activity.entity';

@Injectable()
export class StatsManagerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, 
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(CourseProgress)
    private readonly courseProgressRepo: Repository<CourseProgress>,
    @InjectRepository(LogActivity)
    private readonly logActivityRepo: Repository<LogActivity>,
  ) {}

  async getUserRegisteredStats(nDays: number, to?: string): Promise<UserRegisteredStats> {
    // Calculate date range
    const toDate = to ? new Date(to) : new Date();
    const fromDate = new Date(toDate);
    console.log({ toDate,  fromDate, nDays});
    nDays = nDays||10; // Ensure nDays is at least 1
    fromDate.setDate(toDate.getDate() - nDays + 1); 
    const fromDateString = fromDate.toISOString().slice(0, 10);
    const toDateString = toDate.toISOString().slice(0, 10);

    const qb1 = this.userRepo.createQueryBuilder('u')
      .select('DATE(u.createdAt)', 'date')
      .addSelect('COUNT(*)', 'totalRegistered')
      .addSelect(`COUNT(*) FILTER (WHERE u.role = 'student')`, 'studentsRegistered')
      .addSelect(`COUNT(*) FILTER (WHERE u.role = 'manager')`, 'teachersRegistered')
      .where('u.createdAt >= :fromDate', { fromDate: fromDateString })
      .andWhere('u.createdAt <= :toDate', { toDate: toDateString })
      .groupBy('date'); 
    

    return qb1.getRawMany(); 
  }
  async getUserRegisteredStatsByOrg(nDays: number, to?: string): Promise<UserRegisteredStats[]> {
    // Calculate date range
    const toDate = to ? new Date(to) : new Date();
    const fromDate = new Date(toDate);
    nDays = nDays||10; 
    fromDate.setDate(toDate.getDate() - nDays + 1);

    const fromDateString = fromDate.toISOString().slice(0, 10);
    const toDateString = toDate.toISOString().slice(0, 10);

    const qb1 = this.userRepo.createQueryBuilder('u')
      .select('DATE(u.createdAt)', 'date')
      .addSelect('COUNT(*)', 'totalRegistered')
      .addSelect(`COUNT(*) FILTER (WHERE u.role = 'student')`, 'studentsRegistered')
      .addSelect(`COUNT(*) FILTER (WHERE u.role = 'manager')`, 'teachersRegistered')
      .addSelect('o.id', 'organizationId')
      .innerJoin('u.organization', 'o')
      .where('u.createdAt >= :fromDate', { fromDate: fromDateString })
      .andWhere('u.createdAt <= :toDate', { toDate: toDateString })
      .groupBy('date, o.id');

    return qb1.getRawMany(); 
  } 
  async getLessonCreatedStats(nDays: number, to?: string): Promise<any[]> {
    const end = to ? new Date(to) : new Date();
    const start = new Date(end);
    nDays = nDays||10; 
    start.setDate(end.getDate() - nDays + 1); 
  
    const query = this.lessonRepo.createQueryBuilder('lesson')
      .select("DATE(lesson.createdAt)", "date")
      .addSelect("COUNT(*)", "totalLessons")
      .addSelect(
        `COUNT(*) FILTER (WHERE lesson.meta->>'type' = 'ai')`,
        'aiLessons'
      )
      .where('lesson.createdAt >= :start', { start })
      .andWhere('lesson.createdAt <= :end', { end })
      .groupBy("date")
      .orderBy("date", "ASC");
  
    const raw = await query.getRawMany();
    // Ensure all days covered (fill zeros if desired)
    return raw.map(r => ({
      date: r.date, totalLessons: Number(r.totalLessons), aiLessons: Number(r.aiLessons)
    }));
  }
  async getCourseProgressStats(nDays: number, to?: string): Promise<any[]> {
    const end = to ? new Date(to) : new Date();
    const start = new Date(end);
    nDays = nDays||10; 
    start.setDate(end.getDate() - nDays + 1);
  
    const query = this.courseProgressRepo.createQueryBuilder('cp')
      .select("DATE(cp.createdAt)", "date")
      .addSelect("COUNT(*)", "Started")
      .addSelect("COUNT(*) FILTER (WHERE cp.createdAt != cp.updatedAt)", "Continued")
      .where(
      '(cp.createdAt >= :start AND cp.createdAt <= :end) OR (cp.updatedAt >= :start AND cp.updatedAt <= :end)',
      { start, end }
      )
      .groupBy("date")
      .orderBy("date", "ASC");
  
    const raw = await query.getRawMany();
    return raw
  }
  async logActivityStats(nDays: number, to?: string): Promise<any[]> {
    const end = to ? new Date(to) : new Date();
    const start = new Date(end);
    nDays = nDays||10; 
    start.setDate(end.getDate() - nDays + 1);
  
    const query = this.logActivityRepo.createQueryBuilder('logActivity')
      .select("DATE(logActivity.createdAt)", "date")
      .addSelect("logActivity.action", "action")
      .addSelect("COUNT(*)", "total")
      .where('logActivity.createdAt >= :start', { start })
      .andWhere('logActivity.createdAt <= :end', { end })
      .groupBy("date")
      .addGroupBy("logActivity.action")
      .orderBy("date", "ASC")
      .addOrderBy("logActivity.action", "ASC");
  
    const raw = await query.getRawMany();
    return transformDataReduce(raw);
  }
 async logActivityLast(nDays: number, to?: string): Promise<any[]> {
  const end = to ? new Date(to) : new Date();
  const start = new Date(end);
  nDays = nDays || 10;
  start.setDate(end.getDate() - nDays + 1);

   const query = this.logActivityRepo.createQueryBuilder('logActivity')
    .select([
      'logActivity.id AS id',
      'logActivity.category AS category',
      'logActivity.action AS action',
      'logActivity.user AS user',
      'logActivity.status AS status',
      'logActivity.latency AS latency',
      'logActivity.dump AS dump',
      'logActivity.createdAt AS createdAt',
    ])
    .where('logActivity.createdAt >= :start', { start })
    .andWhere('logActivity.createdAt <= :end', { end })
    .orderBy("logActivity.createdAt", "ASC")

  return await query.getRawMany();
}

}



function transformDataReduce(data:any[]) {
  const grouped = data.reduce((acc, item) => {
    const dateKey = new Date(item.date).toISOString();
    
    if (!acc[dateKey]) {
      acc[dateKey] = { date: item.date };
    }
    
    acc[dateKey][item.action] = parseInt(item.total, 10) || 0; // Ensure total is a number
    return acc;
  }, {});
  
  return Object.values(grouped);
}