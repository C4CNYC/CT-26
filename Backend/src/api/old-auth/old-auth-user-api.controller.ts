import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '@/old-auth/guards/jwt-auth.guard'
import { LoginedUser } from '@/old-auth/interfaces/logined-user.interface'

import { User } from '../../modules/core/user/user.entity'
import { AuthGoogleManagerService } from '../../modules/managers/auth-google-manager/auth-google-manager.service'
import { AuthManagerService } from '../../modules/managers/auth-manager/auth-manager.service'
import { StudentAuthManagerService } from '../../modules/managers/student-auth-manager/student-auth-manager.service'
import { MessageDto } from '../../utils/dtos/message.dto'
import { FILE_SCHEMA } from '../../utils/file-schema'
import { RequestWithMeta } from '../../utils/interfaces/request-with-meta.interface'
import { ParseImagePipe } from '../../utils/parser/parse-image.pipe'
import { AuthGoogleRequestDto } from './dtos/auth-google.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { SignigRequestDto } from './dtos/signin-request.dto'
import { SignupRequestDto } from './dtos/signup-request.dto'
import { SubmitPasswordDto } from './dtos/submit-password.dto'
import { UpdateMetaFlagDto } from './dtos/update-meta-flag.dto'
import { UpdateProfileDto } from './dtos/update-profile.dto'
import { UpdateStudentProfileDto } from './dtos/update-student-profile.dto'

@ApiTags('Auth API')
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeader({ name: 'x-tenant-id' })
@Controller('auth')
export class OldAuthUserApiController {
  constructor(
    private authManagerService: AuthManagerService,
    private studentAuthManagerService: StudentAuthManagerService,
    private googleAuthManagerService: AuthGoogleManagerService,
  ) {}

  @Post('signin')
  async signin(
    @Body() dto: SignigRequestDto,
    @Request() request: RequestWithMeta,
  ): Promise<LoginedUser> {
    return await this.authManagerService.login(dto, request.org_id)
  }

  @Post('signup')
  async singup(
    @Body() dto: SignupRequestDto,
    @Req() req: RequestWithMeta,
  ): Promise<LoginedUser> {
    return await this.authManagerService.register(dto, req.org_id, req.org_name)
  }

  @Post('google-signin')
  async signinWithGoogle(
    @Body() dto: AuthGoogleRequestDto,
  ): Promise<LoginedUser> {
    return await this.googleAuthManagerService.login(dto)
  }

  @Post('google-signup')
  async singupWithGoogle(
    @Body() dto: AuthGoogleRequestDto,
    @Req() req: RequestWithMeta,
  ): Promise<LoginedUser> {
    return await this.authManagerService.registerWithGoogle(dto, req.org_id)
  }

  @Post('reset-password')
  async resetPassord(
    @Body() dto: ResetPasswordDto,
    @Request() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.authManagerService.resetPassword(
      dto,
      request.org_slug,
      request.referrer,
    )
  }
  @Get('reset-password-user/:id')
  async resetPassordUser(@Param('id') id: string): Promise<User> {
    if (!id) {
      throw new Error('Reset password ID is required')
    }
    const user = await this.authManagerService.getResetPasswordUser(id)
    return {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    } as User
  }

  @Post('submit-password')
  async sumbitPassword(@Body() dto: SubmitPasswordDto): Promise<MessageDto> {
    return await this.authManagerService.submitPassword(dto.id, dto.password)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() request: RequestWithMeta): Promise<User | null> {
    const user = await this.authManagerService.getProfile({
      id: request.user.id,
    } as unknown as User)
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/meta-flag')
  async updateMetaFlag(
    @Request() request: RequestWithMeta,
    @Body() dto: UpdateMetaFlagDto,
  ): Promise<void> {
    await this.authManagerService.updateMetaFlag(request.user.id, dto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('student/profile')
  async udpateStudentProfile(
    @Request() request: RequestWithMeta,
    @Body() dto: UpdateStudentProfileDto,
  ): Promise<MessageDto> {
    return await this.studentAuthManagerService.updateProfile(
      request.user.studentID,
      request.user.id,
      dto,
    )
  }

  @Patch('student/profile/avatar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async udpateStudentProfileAvatar(
    @UploadedFile(new ParseImagePipe(200_000))
    file: Express.Multer.File,
    @Req() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.studentAuthManagerService.updateAvatar(
      request.user.studentID,
      request.user.id,
      file,
      request.org_id,
    )
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async udpateProfile(
    @Request() request: RequestWithMeta,
    @Body() dto: UpdateProfileDto,
  ): Promise<MessageDto> {
    return await this.authManagerService.updateProfile(
      request.user as User,
      dto,
    )
  }

  @Patch('profile/avatar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody(FILE_SCHEMA)
  @UseInterceptors(FileInterceptor('file'))
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  async udpateProfileAvatar(
    @UploadedFile(new ParseImagePipe(1_000_000))
    file: Express.Multer.File,
    @Req() request: RequestWithMeta,
  ): Promise<MessageDto> {
    return await this.authManagerService.updateAvatar(
      request.user.id,
      file,
      request.org_id,
    )
  }
}
