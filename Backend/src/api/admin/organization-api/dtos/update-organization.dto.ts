import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator'

import { HomePageType } from '@/modules/core/organization/enums/home-page-type.enum'

export class UpdateOrganizationByOwnerDto {
  @IsString()
  @IsOptional()
  name: string

  @IsEnum(HomePageType)
  @IsOptional()
  home_page_type: HomePageType

  @IsString()
  @IsOptional()
  home_page_body: string

  @IsObject()
  @IsOptional()
  meta: { [key: string]: string | number | boolean }
}
