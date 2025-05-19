import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RewardRequestDocument = HydratedDocument<RewardRequest>;

@Schema({
  collection: 'rewardrequests',
  timestamps: { createdAt: 'requestedAt' },
})
export class RewardRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'events' })
  eventId: mongoose.Types.ObjectId;

  @Prop({ enum: ['PENDING', 'REJECTED', 'GRANTED'], default: 'PENDING' })
  status: string;

  @Prop()
  grantedAt?: Date;

  @Prop()
  reason?: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

RewardRequestSchema.index({ userId: 1, eventId: 1 }, { unique: true });
