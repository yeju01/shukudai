import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: { createdAt: 'requestedAt' } })
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
