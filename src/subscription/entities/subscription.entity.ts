/* eslint-disable prettier/prettier */
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('subscription')
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    userid: number;

    @Column()
    podcastid: number;

    @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'userid' })
  user: User;

  @ManyToOne(() => Podcast, (podcast) => podcast.subscriptions)
  @JoinColumn({ name: 'podcastid' })
  podcast: Podcast;

}
