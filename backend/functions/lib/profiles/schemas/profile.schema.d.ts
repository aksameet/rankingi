import { Document } from 'mongoose';
export type ProfileDocument = Profile & Document;
export declare class Profile {
    name: string;
    email: string;
    rank: number;
    image: string;
}
export declare const ProfileSchema: import("mongoose").Schema<Profile, import("mongoose").Model<Profile, any, any, any, Document<unknown, any, Profile> & Profile & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Profile, Document<unknown, {}, import("mongoose").FlatRecord<Profile>> & import("mongoose").FlatRecord<Profile> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
