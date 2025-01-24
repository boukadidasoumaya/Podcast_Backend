/* eslint-disable prettier/prettier */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimestampEntities } from '../../Generics/timestamp.entities';
import { Comment } from '../../comment/entities/comment.entity';
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

    @OneToMany(() => Episode, episode => episode.podcast)  // One-to-many relation
    episodes: Episode[];  // This will hold the episodes associated with this podcast
  }