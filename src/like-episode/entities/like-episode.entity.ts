import { TimestampEntities } from 'src/Generics/timestamp.entities';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Episode } from '../../episode/entities/episode.entity';
@Entity('like-episode')
export class LikeEpisode extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.likesComment, { nullable: false })
  user: User;


  @ManyToOne(() => Episode, (episode) => episode.likes)
  episode: Episode;
}
