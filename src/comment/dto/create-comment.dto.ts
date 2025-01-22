import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Episode } from '../../episode/entities/episode.entity';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @Type(() => Podcast)
  readonly podcast: Podcast;

  @IsOptional()
  @Type(() => Comment)
  readonly parent?: Comment;

  @IsNotEmpty()
  @Type(() => Episode)
  readonly episode?: Episode;

  @IsNotEmpty()
  @Type(() => User)
  readonly user: User;
}
