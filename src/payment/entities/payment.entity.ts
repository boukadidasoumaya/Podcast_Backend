import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../shared/entities/timestamps.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Payment extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'timestamp' })
  date: Date;  // La date réelle du paiement (jour où le paiement a eu lieu)

  @Column({ default: false })
  isPremium: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;
}
