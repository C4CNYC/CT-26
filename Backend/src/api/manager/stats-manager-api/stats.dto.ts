import { IsArray, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class SeriesDto {
  @IsString()
  label: string;

  @IsArray()
  @ArrayMinSize(1)
  data: number[];

  @IsOptional()
  @IsString()
  color?: string;
}

export class LineChartDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeriesDto)
  series: SeriesDto[];

  @IsArray()
  @IsString({ each: true })
  xaxis: string[];
}