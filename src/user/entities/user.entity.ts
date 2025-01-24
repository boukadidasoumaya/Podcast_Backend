/* eslint-disable prettier/prettier */

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from '../../shared/Enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../../payment/entities/payment.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
@Entity('user')
@TableInheritance({
  column: { type: 'varchar', name: 'role', enum: UserRoleEnum },
})
export class User extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
  @Column()
  username: string;

  @Column({ nullable: true, length: 500 })
  photo: string;

  @Column({ nullable: true })
  profession: string;

  /*@Column({ nullable: true })
  linkedinLink: string;
*/
  @Column({ nullable: true })
  instagramLink: string;

  @Column({ nullable: true })
  whatsappUser: string; 

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  country: string; 

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
  })
  @ApiProperty({
    enum: UserRoleEnum,
  })
  role: string;
  @Column({ nullable: true })
  resetCode: string;

  @Column({ type: 'timestamp', nullable: true })
  resetCodeExpiration: Date;

  @OneToMany(() => Payment, (payment) => payment.user, { nullable: true })
  payments: Payment[];

  @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user, { nullable: true })
  likes: Like[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @ManyToMany(() => Podcast, (podcast) => podcast.subscribers)
  @JoinTable()
  subscriptions: Podcast[];
}