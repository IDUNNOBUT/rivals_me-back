import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'heroes' })
export class Hero {
  @Prop({ type: String, default: uuidv4 as () => string })
  _id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  role: string;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
