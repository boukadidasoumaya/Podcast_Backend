import {
  Column,
  Entity,
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

  @Column({ nullable: true, length: 500 })
  photo: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  facebookLink: string;

  @Column({ nullable: true })
  linkedinLink: string;

  @Column({ nullable: true })
  instagramLink: string;

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

}
