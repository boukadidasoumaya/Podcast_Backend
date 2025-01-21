import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Episode } from '../../episode/entities/episode.entity';
import { HasId } from '../../common/hasid.interface';

@Entity('bookmarks')
export class Bookmark implements HasId {
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
