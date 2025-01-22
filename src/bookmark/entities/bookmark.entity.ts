import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Episode } from '../../episode/entities/episode.entity';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';

@Entity('bookmarks')
export class Bookmark extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation to User
  @ManyToOne(() => User, (user) => user.bookmarks)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation to Episode
  @ManyToOne(() => Episode, (episode) => episode.bookmarks)
  @JoinColumn({ name: 'episodeId' })
  episode: Episode;
}
