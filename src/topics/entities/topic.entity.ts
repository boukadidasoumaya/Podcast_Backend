import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
import { Podcast } from 'src/podcast/entities/podcast.entity';
@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;
 
}
