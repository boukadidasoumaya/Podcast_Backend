import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Podcast } from 'src/podcast/entities/podcast.entity';
@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  episodes: number;

  @Column()
  image: string;
   @ManyToOne(() => Podcast, (podcast) => podcast.Topic)
      podcasts: Podcast[];
}
