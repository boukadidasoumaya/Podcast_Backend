/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { TimestampEntities } from '../../Generics/timestamp.entities';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Episode } from 'src/episode/entities/episode.entity';

@Entity('podcast')
export class Podcast extends TimestampEntities{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 0 })
    views: number;

    @Column()
    duration: string;

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
    @OneToMany(() => Comment, (comment) => comment.podcast)
    comments: Comment[];

    @ManyToMany(() => User, (user) => user.subscriptions)
    subscribers: User[];




  }