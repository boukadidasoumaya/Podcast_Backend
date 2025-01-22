import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  readonly content: string;
}
