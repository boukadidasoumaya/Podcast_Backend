import { TimestampEntities } from 'src/Generics/timestamp.entities';
import { User } from 'src/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { Episode } from '../../episode/entities/episode.entity';
@Entity()
export class Comment extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Podcast)
  @JoinColumn({ name: 'podcastId' })
  podcast: Podcast;

  @ManyToOne(() => Episode)
  @JoinColumn({ name: 'episodeId' })
  episode: Episode;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parent: Comment;
}
