import { Controller } from '@nestjs/common';
import { BaseProfilesController } from '../base-profiles.controller';
import { ProfilesService } from '../profiles.service';

@Controller('profiles')
export class ProfilesController extends BaseProfilesController {
  constructor(profilesService: ProfilesService) {
    super(profilesService, 'profiles');
  }
}
