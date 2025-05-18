import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'] })
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  //@Prop({ default: Date.now })
  //updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
