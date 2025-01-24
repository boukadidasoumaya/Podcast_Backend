import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { DeleteDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
@Entity('episode') // This specifies the table name in PostgreSQL
export class Episode extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  name: string; // Name of the episode

  @Column({ type: 'int' })
  number: number; // Episode number

  
  @Column({ type: 'int' }) // Store duration in seconds (e.g., 1200 seconds = 20 minutes)
  duration: number;

  @Column({ type: 'varchar', length: 255 })
  filepath: string; // Path to the file on the server
  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'int', default: 0 }) // Number of views
  views: number;
  @OneToMany(() => Bookmark, (bookmark) => bookmark.episode)
  bookmarks: Bookmark[];
  @OneToMany(() => Comment, (comment) => comment.episode)
  comments: Comment[];
  @ManyToOne(() => Podcast, podcast => podcast.episodes)  // Many-to-one relation
  podcast: Podcast;  // This is a reference to the related podcast
}
