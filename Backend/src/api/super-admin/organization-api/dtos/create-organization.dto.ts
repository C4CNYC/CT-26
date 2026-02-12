import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { HomePageType } from '@/modules/core/organization/enums/home-page-type.enum'

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  slug: string

  @IsString()
  @IsNotEmpty()
  domain: string

  @IsEnum(HomePageType)
  @IsNotEmpty()
  home_page_type: HomePageType

  @IsObject()
  @IsOptional()
  meta: { [key: string]: string | number | boolean }
}
