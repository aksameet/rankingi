// src/profiles/schemas/profile.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({
  collection: 'profiles',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Profile {
  @Prop({ required: true })
  name!: string;

  @Prop()
  address?: string;

  @Prop()
  telephone?: string;

  @Prop({ required: true, unique: true })
  email?: string;

  @Prop()
  rank?: number;

  @Prop()
  image?: string;

  @Prop()
  description?: string;

  @Prop()
  specialization?: string;

  @Prop()
  geolocation?: string;

  @Prop()
  stars?: number;

  @Prop()
  website?: string;

  @Prop({ required: true, index: true })
  city!: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
