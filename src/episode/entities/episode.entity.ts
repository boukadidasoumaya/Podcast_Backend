import { Entity, Column, PrimaryGeneratedColumn, Like, ManyToOne } from 'typeorm';
import { DeleteDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Podcast } from '../../podcast/entities/podcast.entity';
@Entity('episode') // This specifies the table name in PostgreSQL
export class Episode extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
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


}
