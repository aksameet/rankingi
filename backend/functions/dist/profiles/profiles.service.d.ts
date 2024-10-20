import { Connection } from 'mongoose';
import { ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto, BulkCreateProfileDto } from './dto/bulk-create-profile.dto';
export declare class ProfilesService {
    private readonly connection;
    private models;
    private readonly allowedCollections;
    constructor(connection: Connection);
    private getModel;
    create(collectionName: string, profileData: CreateProfileDto): Promise<ProfileDocument>;
    createBulkProfiles(collectionName: string, bulkData: BulkCreateProfileDto): Promise<ProfileDocument[]>;
    findAll(collectionName: string): Promise<ProfileDocument[]>;
    findAllByCity(collectionName: string, city: string): Promise<ProfileDocument[]>;
    findOne(collectionName: string, id: string): Promise<ProfileDocument>;
    update(collectionName: string, id: string, updateData: Partial<ProfileDocument>): Promise<ProfileDocument>;
    remove(collectionName: string, id: string): Promise<void>;
    deleteAll(collectionName: string): Promise<{
        deletedCount?: number;
    }>;
    deleteAllByCity(collectionName: string, city: string): Promise<{
        deletedCount?: number;
    }>;
}
