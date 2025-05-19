import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ collection: 'rewards' })
export class Reward {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  type: string;
  //note: POINT | ITEM | COUPON

  @Prop({ required: true })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'events' })
  eventId: mongoose.Types.ObjectId;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
