import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class UserAction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  type: string;
  // note: 'login', 'invite', 'quest_clear', 'boss_clear', etc.

  @Prop({ type: mongoose.Schema.Types.Mixed })
  meta?: any;
  // note: questId, inviteCode 등

  @Prop({ required: true })
  occurredAt: Date;
}
