import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
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
  opinions?: number;

  @Prop()
  website?: string;

  @Prop({ required: true, index: true })
  city!: string;

  @Prop()
  company?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
