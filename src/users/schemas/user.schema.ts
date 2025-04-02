import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class User {
  @Prop({ default: uuidv4 as () => string })
  _id: string;
  @Prop()
  name: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: Date(), required: true })
  registeredAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
