import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ collection: 'Profiles' })
export class Profile {
  @Prop({ required: true })
  name: string;

  //   @Prop({ required: true })
  //   email: string;

  // Add additional fields as needed
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
