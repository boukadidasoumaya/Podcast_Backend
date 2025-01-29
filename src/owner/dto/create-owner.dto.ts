import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Podcast } from '../../podcast/entities/podcast.entity';

export class CreateOwnerDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNotEmpty()
  @Type(() => Podcast)
  podcast: Podcast;
}
