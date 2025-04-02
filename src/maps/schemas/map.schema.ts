import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Map {
  @Prop({ type: String, default: uuidv4 as () => string })
  _id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  type: string;
}

export const MapSchema = SchemaFactory.createForClass(Map);
