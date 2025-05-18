import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type eventDocument = HydratedDocument<Event>;

@Schema({ collection: 'events' })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    enum: ['LEVEL', 'attendance', 'invite', 'quest', 'boss_clear'],
  })
  conditionType: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  conditionPayload: any;

  @Prop({ required: true, type: Date })
  startAt: Date;

  @Prop({ required: true, type: Date })
  endAt: Date;

  @Prop({ required: true, enum: ['ACTIVE', 'INACTIVE'] })
  status: string;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'rewards',
  })
  rewards: mongoose.Types.ObjectId[];

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
