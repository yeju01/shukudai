import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserActionDocument = HydratedDocument<UserAction>;

@Schema({
  collection: 'useractions',
  timestamps: { createdAt: 'occurredAt' },
})
export class UserAction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['LOGIN', 'INVITE', 'QUEST', 'BOSS_CLEAR'],
  })
  type: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  meta?: any;
  // note: questId, inviteCode 등

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const UserActionSchema = SchemaFactory.createForClass(UserAction);
