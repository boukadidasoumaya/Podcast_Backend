import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678' })
  oldEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678' })
  newEmail: string;
}
