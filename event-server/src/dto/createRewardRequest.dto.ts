import { IsMongoId } from 'class-validator';

export class CreateRewardRequestDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  eventId: string;
}
