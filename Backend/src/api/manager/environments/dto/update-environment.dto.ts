import { IsOptional, IsString } from 'class-validator';

export class UpdateEnvironmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsString()
  @IsOptional()
  script?: string;
}
