import { IsAlpha, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsAlpha()
  name: string;

  // @IsEmail()
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
