import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Favorite extends Document {
  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  imageUrl: string;

  @Prop()
  birthDate: string;

  @Prop()
  deathDate: string;

  @Prop()
  topWork: string;

  @Prop({ required: true })
  addedBy: string;

  @Prop({ required: true })
  addedAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
