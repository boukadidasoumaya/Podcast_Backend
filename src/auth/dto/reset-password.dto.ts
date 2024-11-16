import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'example@test.com' })
  email: string;

  @ApiProperty({ example: '1234567' })
  @IsString()
  newPassword: string;

  @IsString()
  @ApiProperty({ example: '' })
  code: string;
}
