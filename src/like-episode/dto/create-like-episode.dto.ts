import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Episode } from '../../episode/entities/episode.entity';

export class CreateLikeEpisodeDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
  @IsNotEmpty()
  @Type(() => Episode)
  episode: Episode;
}
