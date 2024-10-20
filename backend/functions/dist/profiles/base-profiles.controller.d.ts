import { ProfilesService } from './profiles.service';
import { CreateProfileDto, BulkCreateProfileDto } from './dto/bulk-create-profile.dto';
import { ProfileDocument } from './schemas/profile.schema';
export declare class BaseProfilesController {
    protected readonly profilesService: ProfilesService;
    protected readonly collectionName: string;
    constructor(profilesService: ProfilesService, collectionName: string);
    create(createProfileDto: CreateProfileDto): Promise<ProfileDocument>;
    createBulk(bulkCreateProfileDto: BulkCreateProfileDto): Promise<ProfileDocument[]>;
    findAll(): Promise<ProfileDocument[]>;
    findAllByCity(cityName: string): Promise<ProfileDocument[]>;
    findOne(id: string): Promise<ProfileDocument>;
    update(id: string, updateData: Partial<ProfileDocument>): Promise<ProfileDocument>;
    remove(id: string): Promise<void>;
    deleteAll(): Promise<{
        message: string;
        deletedCount?: number;
    }>;
    deleteAllByCity(cityName: string): Promise<{
        message: string;
        deletedCount?: number;
    }>;
}
