import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString ,IsDateString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InterestsEnum } from 'src/shared/Enums/interests.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ example: 'example@test.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Salah123' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Salah' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
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

  @ApiProperty({example:"samy.chaffai"})
  @IsOptional()
  @IsString()
  twitterUser?: string;

  @IsNotEmpty()
  @IsString()
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
    required: false,
  })
  photo?: string;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(InterestsEnum, { each: true })
  interests: InterestsEnum[];
}
