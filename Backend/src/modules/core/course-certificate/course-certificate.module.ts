import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CourseCertificate } from './course-certificate.entity'
import { CourseCertificateService } from './course-certificate.service'

@Module({
  imports: [TypeOrmModule.forFeature([CourseCertificate])],
  providers: [CourseCertificateService],
  exports: [CourseCertificateService],
})
export class CourseUnitModule {}
