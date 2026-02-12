import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../../../utils/base/base.service'
import { CourseCertificate } from './course-certificate.entity'

@Injectable()
export class CourseCertificateService extends BaseService<CourseCertificate> {
  constructor(
    @InjectRepository(CourseCertificate)
    public repository: Repository<CourseCertificate>,
  ) {
    super(CourseCertificate, repository)
  }
}
