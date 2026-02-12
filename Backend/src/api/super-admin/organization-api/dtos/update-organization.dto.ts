import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator'

import { HomePageType } from '@/modules/core/organization/enums/home-page-type.enum'

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  id: string

  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  slug: string

  @IsString()
  @IsOptional()
  domain: string

  @IsEnum(HomePageType)
  @IsOptional()
  home_page_type: HomePageType

  @IsString()
  @IsOptional()
  home_page_body: string

  @IsString()
  @IsOptional()
  city: string

  @IsString()
  @IsOptional()
  country: string

  @IsString()
  @IsOptional()
  org_type: string

  @IsOptional()
  student_count_current: number

  @IsOptional()
  student_count_expected: number

  @IsString()
  @IsOptional()
  subdomain: string

  @IsString()
  @IsOptional()
  brandName: string

  @IsString()
  @IsOptional()
  logo: string

  @IsString()
  @IsOptional()
  min_logo: string

  @IsString()
  @IsOptional()
  note: string

  @IsObject()
  @IsOptional()
  meta: { [key: string]: string | number | boolean }
}
