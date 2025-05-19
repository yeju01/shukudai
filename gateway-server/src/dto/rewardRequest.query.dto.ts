import { IsOptional, IsEnum, IsMongoId, IsDateString } from 'class-validator';

export class RewardRequestQueryDto {
  @IsOptional()
  @IsEnum(['PENDING', 'REJECTED', 'GRANTED'])
  status?: string;

  @IsOptional()
  @IsMongoId()
  eventId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
