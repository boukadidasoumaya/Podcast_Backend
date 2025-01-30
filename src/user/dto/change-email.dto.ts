import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'example@test.com' })
  oldEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'example@test.com' })
  newEmail: string;
}
