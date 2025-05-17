import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  //@IsMongoId()
  //id: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  role: string;

  //note: level, 출석연속, 친구초대수, ... 조건에 쓸만한 것들
}
