import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { HasId } from '../../common/hasid.interface';
@Entity('episodes') // This specifies the table name in PostgreSQL
export class Episode implements HasId {
  @PrimaryGeneratedColumn('uuid') // Using UUID for the id
  id: string;
  @Column({ type: 'varchar', length: 255 })
  name: string; // Name of the episode

  @Column({ type: 'int' })
  number: number; // Episode number

  @Column({ type: 'boolean', default: false })
  premium: boolean; // Whether the episode is premium or not

  @Column({ type: 'int' }) // Store duration in seconds (e.g., 1200 seconds = 20 minutes)
  duration: number;

  @Column({ type: 'varchar', length: 255 })
  filepath: string; // Path to the file on the server
}
