import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { DeleteDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { LikeEpisode } from '../../like-episode/entities/like-episode.entity';
@Entity('episode')
@Unique(['podcast', 'number']) // Ensures unique episode number per podcast
export class Episode extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  @Column({ type: 'int' })
  number: number;
  @Column()
  description: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'varchar', length: 255 })
  coverImage: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.episode)
  bookmarks: Bookmark[];
  @OneToMany(() => Comment, (comment) => comment.episode)
  comments: Comment[];

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'podcastId' })
  podcast: Podcast;

  @OneToMany(() => LikeEpisode, (like) => like.episode)
  likes: LikeEpisode[];


}
