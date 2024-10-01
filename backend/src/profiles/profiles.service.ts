import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<Profile[]> {
    const profiles = await this.profilesRepository.find();
    if (profiles.length === 0) {
      const defaultProfiles = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
      ];
      await this.profilesRepository.save(defaultProfiles);
      return defaultProfiles;
    }
    return profiles;
  }

  create(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profilesRepository.create(profileData);
    return this.profilesRepository.save(profile);
  }
}
