import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Podcast } from '../../podcast/entities/podcast.entity';

export class SubscriptionDTO {
  @IsNotEmpty()
  @Type(() => Podcast)
  podcast: Podcast;
}
