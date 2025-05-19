import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ConditionType } from 'src/enum/conditionType.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ConditionType)
  conditionType: ConditionType;

  conditionPayload: any;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsArray()
  @IsMongoId({ each: true })
  rewardIds: string[];

  //@IsMongoId()
  //createdBy: string;
}
