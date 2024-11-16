import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678' })
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678' })
  newPassword: string;
}
