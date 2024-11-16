import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetCodeDto {
  @IsEmail()
  @ApiProperty({ example: 'example@test.com' })
  email: string;
  @ApiProperty({ example: '' })
  @IsString()
  code: string;
}
