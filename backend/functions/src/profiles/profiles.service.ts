// src/profiles/profiles.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ProfileDocument, ProfileSchema } from './schemas/profile.schema';
import {
  CreateProfileDto,
  BulkCreateProfileDto,
} from './dto/bulk-create-profile.dto';

@Injectable()
export class ProfilesService {
  private models: Map<string, Model<ProfileDocument>> = new Map();

  // Allowed collections for security
  private readonly allowedCollections = ['profiles', 'adwokaci', 'radcowie'];

  constructor(@InjectConnection() private readonly connection: Connection) {}

  private getModel(collectionName: string): Model<ProfileDocument> {
    // Security check
    if (!this.allowedCollections.includes(collectionName)) {
      throw new BadRequestException(
        `Collection "${collectionName}" is not allowed.`,
      );
    }

    if (!this.models.has(collectionName)) {
      const model = this.connection.model<ProfileDocument>(
        'Profile',
        ProfileSchema,
        collectionName,
      );
      this.models.set(collectionName, model);
    }
    return this.models.get(collectionName);
  }

  async create(
    collectionName: string,
    profileData: CreateProfileDto,
  ): Promise<ProfileDocument> {
    const model = this.getModel(collectionName);
    const createdProfile = new model(profileData);
    return createdProfile.save();
  }

  async createBulkProfiles(
    collectionName: string,
    bulkData: BulkCreateProfileDto,
  ): Promise<ProfileDocument[]> {
    const model = this.getModel(collectionName);

    const bulkOps = bulkData.profiles.map((profile) => ({
      updateOne: {
        filter: { email: profile.email },
        update: { $set: profile },
        upsert: true,
      },
    }));

    await model.bulkWrite(bulkOps, { ordered: false });

    const emails = bulkData.profiles.map((profile) => profile.email);
    return model.find({ email: { $in: emails } }).exec();
  }

  async findAll(collectionName: string): Promise<ProfileDocument[]> {
    const model = this.getModel(collectionName);
    return model.find().exec();
  }

  async findAllByCity(
    collectionName: string,
    city: string,
  ): Promise<ProfileDocument[]> {
    const model = this.getModel(collectionName);
    return model.find({ city }).exec();
  }

  async findOne(collectionName: string, id: string): Promise<ProfileDocument> {
    const model = this.getModel(collectionName);
    const profile = await model.findById(id).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    return profile;
  }

  async update(
    collectionName: string,
    id: string,
    updateData: Partial<ProfileDocument>,
  ): Promise<ProfileDocument> {
    const model = this.getModel(collectionName);
    const updatedProfile = await model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedProfile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    return updatedProfile;
  }

  async remove(collectionName: string, id: string): Promise<void> {
    const model = this.getModel(collectionName);
    const deletedProfile = await model.findByIdAndDelete(id).exec();
    if (!deletedProfile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
  }

  async deleteAll(collectionName: string): Promise<{ deletedCount?: number }> {
    const model = this.getModel(collectionName);
    const result = await model.deleteMany({});
    return { deletedCount: result.deletedCount };
  }

  async deleteAllByCity(
    collectionName: string,
    city: string,
  ): Promise<{ deletedCount?: number }> {
    const model = this.getModel(collectionName);
    const result = await model.deleteMany({ city });
    return { deletedCount: result.deletedCount };
  }
}
