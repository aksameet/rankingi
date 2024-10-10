import { Controller } from '@nestjs/common';
import { BaseProfilesController } from '../base-profiles.controller';
import { ProfilesService } from '../profiles.service';

@Controller('adwokaci')
export class AdwokaciController extends BaseProfilesController {
  constructor(profilesService: ProfilesService) {
    super(profilesService, 'adwokaci');
  }
}
