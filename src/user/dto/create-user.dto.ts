import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InterestsEnum } from 'src/shared/Enums/interests.enum';

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
  @IsNotEmpty()
  @ApiProperty({ example: 25033950 })
  phone: number;
  @ApiProperty({example:"Content Creator"})
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiProperty({example:"https://www.facebook.com/samychaffaiofficiel"})
  @IsOptional()
  @IsString()
  facebookLink?: string;

  @ApiProperty({example:"https://www.linkedin.com/in/samy-chaffa%C3%AF/"})
  @IsOptional()
  @IsString()
  linkedinLink?: string;

  @ApiProperty({example:"https://www.instagram.com/samy.chaffai/"})
  @IsOptional()
  @IsString()
  instagramLink?: string;

  @IsNotEmpty()
  @ApiProperty({ example: 12345678 })

  password: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Photo of the user',
    required: false,
  })
  photo: string;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(InterestsEnum, { each: true })
  @ApiProperty({
    example: ['MUSIC', 'SPORTS'],
    type: [String],
    enum: InterestsEnum,
    isArray: true,
    description: 'An array of interests',
  })
  interests: InterestsEnum[];
}
