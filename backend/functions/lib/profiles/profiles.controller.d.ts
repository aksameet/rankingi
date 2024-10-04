import { ProfilesService } from './profiles.service';
import { Profile } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
export declare class ProfilesController {
    private profilesService;
    constructor(profilesService: ProfilesService);
    create(createProfileDto: CreateProfileDto): Promise<Profile>;
    findAll(): Promise<Profile[]>;
    findOne(id: string): Promise<Profile>;
    update(id: string, updateData: Partial<Profile>): Promise<Profile>;
    remove(id: string): Promise<any>;
}
