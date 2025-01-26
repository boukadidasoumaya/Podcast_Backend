import { Episode } from '../../episode/entities/episode.entity';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';  // Assurez-vous d'importer l'entité Episode

export class GetEpisodeResponseDto {
  @IsNotEmpty()
  @Type(() => Episode)
  episode: Episode;

  @IsNotEmpty()
  numberOfLikes: number;
}
