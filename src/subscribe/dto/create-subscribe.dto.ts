import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";

export class CreateSubscribeDto {
     @IsNotEmpty()
      @IsEmail()
      @ApiProperty({ example: 'example@test.com' })
      email: string;
    
}
