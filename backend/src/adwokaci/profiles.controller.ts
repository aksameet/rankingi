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
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('adwokaci')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  async findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
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
}
