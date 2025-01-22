import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DeleteDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
@Entity('episodes') // This specifies the table name in PostgreSQL
export class Episode extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  Title: string; // Name of the episode

  @Column({ type: 'int' })
  number: number; // Episode number


  @Column({ type: 'int' }) // Store duration in seconds (e.g., 1200 seconds = 20 minutes)
  duration: number;

  @Column({ type: 'varchar', length: 255 })
  filepath: string; // Path to the file on the server
  @DeleteDateColumn()
  deletedAt: Date;
  @OneToMany(() => Bookmark, (bookmark) => bookmark.episode)
  bookmarks: Bookmark[];
  @Column({ default: 0 }) // Initialize with 0 views
  views: number;
}
