import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';
import { UserRoleEnum } from 'src/shared/Enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@test.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Salah123' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Salah' })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Foulen' })
  lastName: string;
  
  @ApiProperty({example:"Content Creator"})
  @IsOptional()
  @IsString()
  profession?: string;

  /*@ApiProperty({example:"https://www.facebook.com/samychaffaiofficiel"})
  @IsOptional()
  @IsString()
  facebookLink?: string;
  @ApiProperty({example:"https://www.linkedin.com/in/samy-chaffa%C3%AF/"})
  @IsOptional()
  @IsString()
  linkedinLink?: string;
*/

  @IsOptional()
  @ApiProperty({ example: '+21625033950' })
  @IsString()
  whatsappUser?: string;

  @ApiProperty({example:"https://www.instagram.com/samy.chaffai/"})
  @IsOptional()
  @IsString()
  instagramLink?: string;

  @IsNotEmpty()
  @ApiProperty({ example: 12345678 })
  password: string;

  @IsOptional()
  @ApiProperty({ example: 'Tunisia' })
  @IsString()
  country?: string;

  @IsOptional()
  @ApiProperty({ example: '2000-01-01' })
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Photo of the user',
    required: false,
  })
  photo?: string;

  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  @ApiProperty({ example: UserRoleEnum.USER, enum: UserRoleEnum })
  role: UserRoleEnum;
}
