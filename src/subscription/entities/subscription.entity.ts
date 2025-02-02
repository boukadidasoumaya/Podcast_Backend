/* eslint-disable prettier/prettier */
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampEntities } from '../../Generics/timestamp.entities';


@Entity('subscription')
export class Subscription extends TimestampEntities{
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => User, (user) => user.subscriptions, { nullable: false })
  user: User;

  @ManyToOne(() => Podcast, (podcast) => podcast.subscriptions, { nullable: false })
  podcast: Podcast;

}
