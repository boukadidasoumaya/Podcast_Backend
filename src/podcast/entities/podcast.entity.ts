/* eslint-disable prettier/prettier */

import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany  } from "typeorm";

@Entity('podcast')
export class Podcast {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 0 })
    views: number;

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
    
    @ManyToMany(() => User, (user) => user.subscriptions)
    subscribers: User[];

    


  }