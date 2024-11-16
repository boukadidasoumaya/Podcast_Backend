import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from '../../shared/Enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

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
}
