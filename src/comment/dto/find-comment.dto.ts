import { Podcast } from '../../podcast/entities/podcast.entity';
import { Episode } from '../../episode/entities/episode.entity';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class FindCommentDto {
  @IsNotEmpty()
  @Type(() => Podcast)
  readonly podcast: Podcast;

  @IsNotEmpty()
  @Type(() => Episode)
  readonly episode?: Episode;
}
