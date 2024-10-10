// src/profiles/base-profiles.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  CreateProfileDto,
  BulkCreateProfileDto,
} from './dto/bulk-create-profile.dto';
import { ProfileDocument } from './schemas/profile.schema';

@Controller() // No path specified here; it will be defined in derived controllers
export class BaseProfilesController {
  constructor(
    protected readonly profilesService: ProfilesService,
    protected readonly collectionName: string,
  ) {}

  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    return this.profilesService.create(this.collectionName, createProfileDto);
  }

  @Post('bulk')
  async createBulk(
    @Body() bulkCreateProfileDto: BulkCreateProfileDto,
  ): Promise<ProfileDocument[]> {
    return this.profilesService.createBulkProfiles(
      this.collectionName,
      bulkCreateProfileDto,
    );
  }

  @Get()
  async findAll(): Promise<ProfileDocument[]> {
    return this.profilesService.findAll(this.collectionName);
  }

  @Get('city/:cityName')
  async findAllByCity(
    @Param('cityName') cityName: string,
  ): Promise<ProfileDocument[]> {
    return this.profilesService.findAllByCity(this.collectionName, cityName);
  }

  @Delete('city/:cityName')
  async deleteAllByCity(
    @Param('cityName') cityName: string,
  ): Promise<{ message: string; deletedCount?: number }> {
    const result = await this.profilesService.deleteAllByCity(
      this.collectionName,
      cityName,
    );
    return {
      message: `All profiles in city "${cityName}" have been deleted successfully.`,
      deletedCount: result.deletedCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProfileDocument> {
    return this.profilesService.findOne(this.collectionName, id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<ProfileDocument>,
  ): Promise<ProfileDocument> {
    return this.profilesService.update(this.collectionName, id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.profilesService.remove(this.collectionName, id);
  }

  @Delete()
  async deleteAll(): Promise<{ message: string; deletedCount?: number }> {
    const result = await this.profilesService.deleteAll(this.collectionName);
    return {
      message: 'All profiles have been deleted successfully.',
      deletedCount: result.deletedCount,
    };
  }
}
