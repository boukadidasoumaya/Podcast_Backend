import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('SubscribeAll')
export class SubscribeAll {
 @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
}
