import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Episode } from '../../episode/entities/episode.entity';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { Unique } from 'typeorm';
@Entity()
@Unique(['user', 'episode']) // Prevent duplicate bookmarks for the same episode per user
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Episode, (episode) => episode.bookmarks, { onDelete: 'CASCADE' })
  episode: Episode;

  
}