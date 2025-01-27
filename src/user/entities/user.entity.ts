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
import { Exclude, Transform } from 'class-transformer';
import { UserRoleEnum } from '../../shared/Enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../../payment/entities/payment.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { LikeEpisode } from '../../like-episode/entities/like-episode.entity';
import { LikeComment } from '../../like-comment/entities/like-comment.entity';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { InterestsEnum } from 'src/shared/Enums/interests.enum';
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
  @Transform(() => undefined)

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


  @Column({
    type: 'json', // Utilisation du type JSON natif
    nullable: true, // Permet de ne pas définir ce champ
  })
  interests: InterestsEnum[];

  @Column({
    default: false,
  })
  isOwner: boolean;

  @Exclude()
  @Transform(() => undefined)
  @Column({ nullable: true })
  resetCode: string;
  @Exclude()
  @Transform(() => undefined)
  @Column({ type: 'timestamp', nullable: true })
  resetCodeExpiration: Date;

  @OneToMany(() => Payment, (payment) => payment.user, { nullable: true })
  payments: Payment[];

  @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
  comments: Comment[];

  @OneToMany(() => LikeEpisode, (like) => like.user, { nullable: true })
  likesEpisode: LikeEpisode[];

  @OneToMany(() => LikeComment, (like) => like.user, { nullable: true })
  likesComment: LikeComment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @ManyToMany(() => Podcast, (podcast) => podcast.subscribers)
  @JoinTable()
  subscriptions: Podcast[];

  @OneToMany(() => Podcast, (podcast) => podcast.user)
  podcasts: Podcast[];
}