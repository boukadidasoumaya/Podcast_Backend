import { TimestampEntities } from "src/Generics/timestamp.entities";
import { User } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
@Entity()
export class Comment extends TimestampEntities {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    content: string;
    @ManyToOne(() => User, (user) => user.comments) 
    user: User;
  
    // @ManyToOne(() => Podcast, podcast => podcast.comments)
    // podcast: Podcast;
  
}
