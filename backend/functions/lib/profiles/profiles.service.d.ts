import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';
export declare class ProfilesService {
    private profileModel;
    constructor(profileModel: Model<ProfileDocument>);
    create(profileData: Partial<Profile>): Promise<Profile>;
    findAll(): Promise<Profile[]>;
    findOne(id: string): Promise<Profile>;
    update(id: string, updateData: Partial<Profile>): Promise<Profile>;
    remove(id: string): Promise<void>;
}
