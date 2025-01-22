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

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Podcast, (podcast) => podcast.comments,{
    nullable: false,
  })
  podcast: Podcast;

  @ManyToOne(() => Episode,(episode) => episode.comments, {
    nullable: false,
  })
  episode: Episode;

  @OneToMany(() => Comment, (comment) => comment.parent, {
    nullable: true,
    cascade: ['soft-remove'],
  })
  replies: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parent: Comment;
}
