import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

import { Role } from '@/modules/core/user/enums/role.enum'
import { AccessControlManagerService } from '@/modules/managers/access-control-manager/access-control-manager-service'
import { AccessControlUpdateDto } from '@/modules/managers/access-control-manager/access-control-update.dto'
import { Roles } from '@/old-auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '@/old-auth/guards/role-auth.guard'
import { RequestWithMeta } from '@/utils/interfaces/request-with-meta.interface'

@ApiTags('Access Control API', 'To control feature access')
@ApiHeader({ name: 'x-tenant-id' })
@Controller('access-control')
export class AccessControlAPIController {
  constructor(private featureService: AccessControlManagerService) {}
  @Get('/all')
  async getAllFeatures() {
    return await this.featureService.getAllFeatures()
  }

  @UseGuards(JwtAuthGuard)
  @Get('/self')
  async getSelfAccess(@Request() request: RequestWithMeta) {
    return await this.featureService.getByUserId(request.user.id)
  }

  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @Get('/:userId')
  async getByUserId(@Param('userId') userId: string) {
    return await this.featureService.getByUserId(userId)
  }
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Delete('/:feature')
  async decreaseToUserId(
    @Param('feature') feature: string,
    @Request() request: RequestWithMeta,
  ) {
    return await this.featureService.decreaseToUserId(request.user.id, feature)
  }

  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles(Role.SuperAdmin, Role.Admin, Role.Owner, Role.Manager)
  @Post('/:userId')
  async addFeature(
    @Param('userId') userId: string,
    @Body() dto: AccessControlUpdateDto,
  ) {
    return await this.featureService.setToUserId(userId, dto)
  }
}
