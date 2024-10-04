import { IsString, IsEmail, Length } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  //   @IsEmail()
  //   email: string;

  // Add additional validation rules as needed
}
