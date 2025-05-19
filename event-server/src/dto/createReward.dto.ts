import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RewardType } from 'src/enum/rewardType.enum';

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(RewardType)
  type: RewardType;

  @IsNumber()
  amount: number;

  @IsMongoId()
  eventId: string;
}
