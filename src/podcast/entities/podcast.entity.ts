/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import { TimestampEntities } from '../../Generics/timestamp.entities';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Episode } from 'src/episode/entities/episode.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
@Entity('podcast')
export class Podcast extends TimestampEntities{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 0 })
    views: number;

    @Column()
    duration: number;

    @Column()
    description: string;

    @Column({ default: '' })
    image: string;

    @Column({ default: 0 })
    rating: number;

    @Column({ default: 0 })
    download_Count: number;

    @Column({ default: 0 })
    nbre_episode: number;
    @OneToMany(() => Comment, (comment) => comment.podcast,  { onDelete: 'CASCADE' })
    comments: Comment[];

    @ManyToMany(() => User, (user) => user.subscriptions,  { onDelete: 'CASCADE' })
    subscribers: User[];

    @OneToMany(() => Episode, (episode) => episode.podcast,  { cascade: true, onDelete: 'CASCADE' })
    episodes: Episode[];

    @ManyToOne(()=>User,(user)=>user.podcasts)
    user: User;
    @ManyToOne(() => Topic, { nullable: true,cascade:true })
    topic: Topic;

    @OneToMany(()=>Subscription,(subscription)=>subscription.podcast,  { onDelete: 'CASCADE' })
    subscriptions: Subscription[];

}