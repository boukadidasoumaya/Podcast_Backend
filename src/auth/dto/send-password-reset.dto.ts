import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPasswordResetDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@test.com' })
  email: string;
}
