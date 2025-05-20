import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  newRole: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}
