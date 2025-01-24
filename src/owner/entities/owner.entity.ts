import { PartialType } from "@nestjs/mapped-types";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { InterestsEnum } from "../../shared/Enums/interests.enum";
@Entity("Owner")
export class Owner extends PartialType(User) {
    @PrimaryGeneratedColumn()
    id: number;



}
