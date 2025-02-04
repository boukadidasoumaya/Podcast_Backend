import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactUsDto {
  @ApiProperty({
    description: "Nom complet de l'utilisateur",
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Objet du message',
    example: 'Problème avec mon compte',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Contenu du message',
    example: "Bonjour, j'ai un souci avec mon compte. Merci de m'aider.",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
