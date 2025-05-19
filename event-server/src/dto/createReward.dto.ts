import { IsEnum, IsMongoId, IsNumber, IsString } from 'class-validator';
import { RewardType } from 'src/enum/rewardType.enum';

export class CreateRewardDto {
  @IsString()
  name: string;

  description?: string;

  @IsEnum(RewardType)
  type: RewardType;

  @IsNumber()
  amount: number;

  @IsMongoId()
  eventId: string;
}
