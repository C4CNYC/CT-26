
import { Injectable } from '@nestjs/common';
import { S3Service } from '../../../providers/s3/s3.service';
import { Environment } from './entities/environment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { User } from '@/modules/core/user/user.entity';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { TENANT_PATH_BUILDER } from '@/utils/s3/tenant-path-builder';
import { Lesson } from '../../../modules/core/lesson/lesson.entity';
import { LessonContent } from '../../../modules/core/lesson-content/lesson-content.entity';

import path = require('path')

@Injectable()
export class EnvironmentsService {
  constructor(
    @InjectRepository(Environment)
    private readonly environmentRepository: Repository<Environment>,
    private readonly s3Service: S3Service,
  ) { }

  async create(
    createEnvironmentDto: CreateEnvironmentDto,
    org_id: string,
    user: User
  ): Promise<Environment> {
    const { file, ...dto } = createEnvironmentDto;
    const environment = this.environmentRepository.create({
      ...dto,
      user,
    });

    if (file) {
      const filePath = `${TENANT_PATH_BUILDER.envs(org_id, environment.id)}.${path.extname(file.originalname)}`;
      const s3Url = await this.s3Service.uploadFile(filePath, file.buffer);
      console.log('Uploaded file to S3:', s3Url);
      environment.zipFile = s3Url;
    }

    return this.environmentRepository.save(environment);
  }

  findAll() {
    return this.environmentRepository.find();
  }

  findOne(id: string) {
    return this.environmentRepository.findOne(
      {
        where: { id },
        relations: ['user']
      });
  }

  async update(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment> {
    const environment = await this.environmentRepository.preload({
      id,
      ...updateEnvironmentDto,
    });
    if (!environment) {
      throw new Error('Environment not found');
    }
    return this.environmentRepository.save(environment);
  }

  async remove(id: string): Promise<void> {
    await this.environmentRepository.delete(id);
  }

  async uploadFile(
    id: string,
    org_id: string,
    file: Express.Multer.File): Promise<Environment> {
    const environment = await this.findOne(id);
    if (!environment) {
      throw new Error('Environment not found');
    }

    const filePath = `${TENANT_PATH_BUILDER.envs(org_id, environment.id)}.${path.extname(file.originalname)}`;
    const s3Url = await this.s3Service.uploadFile(filePath, file.buffer);
    console.log('Uploaded file to S3:', s3Url);
    environment.zipFile = s3Url;

    return this.environmentRepository.save(environment);
  }

  async getLessons(id: string): Promise<Lesson[]> {
    const environment = await this.environmentRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });
    if (!environment) {
      throw new Error('Environment not found');
    }
    return environment.lessons;
  }

  async findOneWithLessons(id: string): Promise<Environment | null> {
    return this.environmentRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });
  }

  async getLessonContents(id: string): Promise<LessonContent[]> {
    const environment = await this.environmentRepository.findOne({
      where: { id },
      relations: ['lessonContents'],
    });
    if (!environment) {
      throw new Error('Environment not found');
    }
    return environment.lessonContents;
  }

  async findOneWithLessonContents(id: string): Promise<Environment | null> {
    return this.environmentRepository.findOne({
      where: { id },
      relations: ['lessonContents'],
    });
  }
}
