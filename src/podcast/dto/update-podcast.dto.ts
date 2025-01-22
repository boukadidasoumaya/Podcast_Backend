import { PartialType } from '@nestjs/swagger';
import { CreatePodcastDto } from './create-podcast.dto';
import { IsNumber } from 'class-validator';

export class UpdatePodcastDto extends PartialType(CreatePodcastDto) {


  @IsNumber()
  views: number;

  @IsNumber()
  rating: number;

  @IsNumber()
  download_Count: number;

  
}
