// src/profiles/profiles.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './schemas/profile.schema';
import {
  CreateProfileDto,
  BulkCreateProfileDto,
} from './dto/bulk-create-profile.dto';

@Controller('adwokaci')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profilesService.create(createProfileDto);
  }

  @Post('bulk')
  async createBulk(
    @Body() bulkCreateProfileDto: BulkCreateProfileDto,
  ): Promise<Profile[]> {
    return this.profilesService.createBulkProfiles(bulkCreateProfileDto);
  }

  @Get()
  async findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Get('city/:cityName')
  async findAllByCity(@Param('cityName') cityName: string): Promise<Profile[]> {
    return this.profilesService.findAllByCity(cityName);
  }

  @Delete('city/:cityName')
  async deleteAllByCity(
    @Param('cityName') cityName: string,
  ): Promise<{ message: string; deletedCount?: number }> {
    const result = await this.profilesService.deleteAllByCity(cityName);
    return {
      message: `All profiles in city "${cityName}" have been deleted successfully.`,
      deletedCount: result.deletedCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Profile>,
  ): Promise<Profile> {
    return this.profilesService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.profilesService.remove(id);
  }

  @Delete()
  async deleteAll(): Promise<{ message: string; deletedCount?: number }> {
    const result = await this.profilesService.deleteAll();
    return {
      message: 'All profiles have been deleted successfully.',
      deletedCount: result.deletedCount,
    };
  }
}
