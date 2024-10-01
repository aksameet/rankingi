import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './profile.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Post()
  create(@Body() profileData: Partial<Profile>): Promise<Profile> {
    return this.profilesService.create(profileData);
  }
}
