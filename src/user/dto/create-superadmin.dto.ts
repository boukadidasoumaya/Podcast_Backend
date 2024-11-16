import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSuperAdminDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@test.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Salah' })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Foulen' })
  lastName: string;

  @IsNotEmpty()
  @ApiProperty({ example: '12345678' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: '!569@podcast1345' })
  license: string;
}
