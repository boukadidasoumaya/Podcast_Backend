import { PartialType } from "@nestjs/mapped-types";
import { User } from "src/user/entities/user.entity";
import { Column } from "typeorm";

export class Owner extends PartialType(User) {
    @Column() 
    interests: string[];
}
