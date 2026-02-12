
import { User } from "@/modules/core/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Lesson } from "../../../../modules/core/lesson/lesson.entity";
import { LessonToEnvironment } from "../../../../modules/core/lesson-to-environment/lesson-to-environment.entity";
import { LessonContent } from "../../../../modules/core/lesson-content/lesson-content.entity";
import { LessonContentToEnvironment } from "../../../../modules/core/lesson-content-to-environment/lesson-content-to-environment.entity";

@Entity()
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  style: string;

  @Column({ type: 'text', nullable: true })
  script: string;

  @Column({ nullable: true })
  zipFile: string;

  @ManyToOne(() => User, (user) => user.environments)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Lesson, (lesson) => lesson.environments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'lesson_to_environment',
    joinColumn: { name: 'environmentId' },
    inverseJoinColumn: { name: 'lessonId' },
  })
  lessons: Lesson[];

  @OneToMany(
    () => LessonToEnvironment,
    (lessonToEnvironment) => lessonToEnvironment.environment,
  )
  lessonToEnvironments: LessonToEnvironment[];

  @ManyToMany(() => LessonContent, (lessonContent) => lessonContent.environments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'lesson_content_to_environment',
    joinColumn: { name: 'environmentId' },
    inverseJoinColumn: { name: 'lessonContentId' },
  })
  lessonContents: LessonContent[];

  @OneToMany(
    () => LessonContentToEnvironment,
    (lessonContentToEnvironment) => lessonContentToEnvironment.environment,
  )
  lessonContentToEnvironments: LessonContentToEnvironment[];
}
