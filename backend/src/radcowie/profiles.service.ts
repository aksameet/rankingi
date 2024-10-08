import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('Radcowie') private profileModel: Model<ProfileDocument>,
  ) {}

  async create(profileData: Partial<Profile>): Promise<Profile> {
    const createdProfile = new this.profileModel(profileData);
    return createdProfile.save();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileModel.findById(id).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    return profile;
  }

  async update(id: string, updateData: Partial<Profile>): Promise<Profile> {
    const updatedProfile = await this.profileModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedProfile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    return updatedProfile;
  }

  async remove(id: string): Promise<void> {
    const deletedProfile = await this.profileModel.findByIdAndDelete(id).exec();
    if (!deletedProfile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
  }
}
