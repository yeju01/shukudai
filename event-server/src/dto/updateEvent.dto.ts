import { IsEnum, IsMongoId } from 'class-validator';
import { StatusType } from 'src/enum/statusType.enum';

export class UpdateEventDto {
  @IsEnum(StatusType)
  statusType: StatusType;

  @IsMongoId()
  eventId: string;
}
