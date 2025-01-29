import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Subscriber')
export class Subscriber {
 @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
}
