import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Unique, JoinColumn } from 'typeorm';
import { DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Min } from 'class-validator';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { LikeEpisode } from '../../like-episode/entities/like-episode.entity';

@Entity('episode')
@Unique(['podcast', 'number']) // Ensures unique episode number per podcast
export class Episode extends TimestampEntity {
  
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier for the episode' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Introduction to AI', description: 'Episode name' })
  @IsString()
  name: string;

  @Column({ type: 'int' })
  @ApiProperty({ example: 1, description: 'Episode number within the podcast' })
  @IsInt()
  @Min(1)
  number: number;

  @Column()
  @ApiProperty({ example: 'This episode covers the basics of AI.', description: 'Short episode description' })
  @IsString()
  description: string;

  @Column({ type: 'int' })
  @ApiProperty({ example: 3600, description: 'Duration in seconds' })
  @IsInt()
  @Min(1)
  duration: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'https://example.com/cover.jpg', description: 'Cover image URL' })
  @IsString()
  coverImage: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: '/uploads/episode1.mp3', description: 'Path to the audio file' })
  @IsString()
  filepath: string;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ example: 100, description: 'Number of views' })
  @IsInt()
  @Min(0)
  views: number;

  // Relationship with Bookmark entity
  @OneToMany(() => Bookmark, (bookmark) => bookmark.episode, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => [Bookmark], description: 'List of bookmarks associated with this episode' })
  bookmarks: Bookmark[];

  // Relationship with Comment entity
  @OneToMany(() => Comment, (comment) => comment.episode,  { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => [Comment], description: 'List of comments on this episode' })
  comments: Comment[];

  // Many-to-One relationship with Podcast entity
  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  @JoinColumn({ name: 'podcastId' })
  @ApiProperty({ type: () => Podcast, description: 'Podcast this episode belongs to' })
  podcast: Podcast;

  // Relationship with LikeEpisode entity
  @OneToMany(() => LikeEpisode, (like) => like.episode , { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => [LikeEpisode], description: 'List of likes for this episode' })
  likes: LikeEpisode[];
}
