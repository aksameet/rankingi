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
    @InjectModel('Radcowie') private profileModel: Model<ProfileDocument>,
  ) {}

  async create(profileData: CreateProfileDto): Promise<Profile> {
    const createdProfile = new this.profileModel(profileData);
    return createdProfile.save();
  }

  async createBulkProfiles(bulkData: BulkCreateProfileDto): Promise<Profile[]> {
    const bulkOps = bulkData.profiles.map((profile) => ({
      updateOne: {
        filter: { email: profile.email },
        update: { $set: profile },
        upsert: true,
      },
    }));

    await this.profileModel.bulkWrite(bulkOps, { ordered: false });

    const emails = bulkData.profiles.map((profile) => profile.email);
    return this.profileModel.find({ email: { $in: emails } }).exec();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findAllByCity(city: string): Promise<Profile[]> {
    return this.profileModel.find({ city }).exec();
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

  async deleteAllByCity(city: string): Promise<{ deletedCount?: number }> {
    const result = await this.profileModel.deleteMany({ city });
    return { deletedCount: result.deletedCount };
  }
}
