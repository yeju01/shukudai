import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  role: string;
}
