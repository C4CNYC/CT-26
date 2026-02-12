import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum LogActivityCategory {
  USER = 'user',
  PAGE = 'page',
  NOTIFICATION = 'notif'
}

export interface LogActivityUserInfo {
  ip?: string;
  tenant?: string;
  userid?: string;
  email?: string;
  userAgent?: string;
}

@Entity('log_activity')
export class LogActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LogActivityCategory,
    nullable: false
  })
  category: LogActivityCategory;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  action: string;

  @Column({
    type: 'jsonb',
    nullable: false
  })
  user: LogActivityUserInfo;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  status: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Response time in milliseconds'
  })
  latency: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Flexible field to store any additional data'
  })
  dump: any;
}