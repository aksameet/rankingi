// src/profiles/profiles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';
import {
  BulkCreateProfileDto,
  CreateProfileDto,
} from './dto/bulk-create-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('Default') private profileModel: Model<ProfileDocument>,
  ) {}

  async create(profileData: CreateProfileDto): Promise<Profile> {
    const createdProfile = new this.profileModel(profileData);
    return createdProfile.save();
  }

  async createBulkProfiles(bulkData: BulkCreateProfileDto): Promise<Profile[]> {
    const bulkOps = bulkData.profiles.map((profile) => ({
      updateOne: {
        filter: { email: profile.email }, // Use a unique field like 'email'
        update: { $set: profile },
        upsert: true,
      },
    }));

    await this.profileModel.bulkWrite(bulkOps, { ordered: false });

    // Retrieve and return the upserted profiles
    const emails = bulkData.profiles.map((profile) => profile.email);
    return this.profileModel.find({ email: { $in: emails } }).exec();

    // return this.profileModel.insertMany(bulkData.profiles);
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

  async deleteAll(): Promise<{ deletedCount?: number }> {
    const result = await this.profileModel.deleteMany({});
    return { deletedCount: result.deletedCount };
  }
}
