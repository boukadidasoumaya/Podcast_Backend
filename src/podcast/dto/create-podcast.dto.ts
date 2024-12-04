/* eslint-disable prettier/prettier */
import { IsString, IsNumber, Min, Max , IsOptional, IsUrl } from 'class-validator';

export class CreatePodcastDto {
  @IsString()
  name: string;

  @IsNumber()
  views: number;

  @IsString()
  duration: string;

  @IsString()
  description: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNumber()
  download_Count: number;
}
