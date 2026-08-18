import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  user_id?: string;

  @IsString()
  @IsNotEmpty()
  device_id?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  usertype?: string;

}