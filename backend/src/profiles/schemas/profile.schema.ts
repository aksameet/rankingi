import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({
  collection: 'Profiles',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id; // Map _id to id
      delete ret._id; // Remove _id
    },
  },
})
export class Profile {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: false })
  email!: string;

  @Prop({ required: false })
  rank!: number;

  @Prop({ required: false })
  image!: string;

  @Prop({ required: false })
  description!: string;
  // Add additional fields as needed
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
