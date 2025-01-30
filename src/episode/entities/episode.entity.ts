import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Unique } from 'typeorm';
import { JoinColumn } from 'typeorm';
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
  name: string;

  @Column({ type: 'int' })
  number: number; // Unique number for each episode within the podcast

  @Column()
  description: string;

  @Column({ type: 'int' })
  duration: number; // Duration in seconds (or minutes depending on your choice)

  @Column({ type: 'varchar', length: 255 })
  coverImage: string;
  @Column({ type: 'varchar', length: 255 })
  filepath: string;

  @Column({ type: 'int', default: 0 })
  views: number; // Number of views

  // Relationship with Bookmark entity
  @OneToMany(() => Bookmark, (bookmark) => bookmark.episode)
  bookmarks: Bookmark[];

  // Relationship with Comment entity
  @OneToMany(() => Comment, (comment) => comment.episode)
  comments: Comment[];

  // Many-to-One relationship with Podcast entity
  @ManyToOne(() => Podcast, (podcast) => podcast.episodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'podcastId' })
  podcast: Podcast;

  // Relationship with LikeEpisode entity
  @OneToMany(() => LikeEpisode, (like) => like.episode)
  likes: LikeEpisode[];
}
