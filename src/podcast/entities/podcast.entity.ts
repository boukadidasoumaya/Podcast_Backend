/* eslint-disable prettier/prettier */

import { Entity, PrimaryGeneratedColumn, Column  } from "typeorm";
import { TimestampEntities } from '../../Generics/timestamp.entities';

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


  }