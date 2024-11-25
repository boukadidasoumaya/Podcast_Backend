import { TimestampEntities } from "src/Generics/timestamp.entities";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Like extends TimestampEntities {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User, user => user.likes)
  user: User;

  // @ManyToOne(() => Podcast, podcast => podcast.likes)
  // podcast: Podcast;
    
  }
