import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Game {
  @Prop({ type: String, default: uuidv4 as () => string })
  _id: string;
  @Prop({ type: String, ref: 'User', required: true })
  user: string;
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true })
  duration: number;
  @Prop({ type: String, ref: 'Hero', required: true })
  hero: string;
  @Prop({ type: String, ref: 'Map', required: true })
  map: string;
  @Prop({ required: true })
  ranked: boolean;
  @Prop({ required: true })
  win: boolean;
  @Prop({ required: true })
  kills: number;
  @Prop({ required: true })
  deaths: number;
  @Prop({ required: true })
  assists: number;
}

export const GameSchema = SchemaFactory.createForClass(Game);
