import { PartialType } from "@nestjs/mapped-types";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { InterestsEnum } from "../../shared/Enums/interests.enum";
@Entity()
export class Owner extends PartialType(User) {
    @PrimaryGeneratedColumn()
    id: number;

  @Column({
    type: 'enum',
    enum: InterestsEnum,
  })
  interests : string[];

}
