import { Controller } from '@nestjs/common';
import { BaseProfilesController } from '../base-profiles.controller';
import { ProfilesService } from '../profiles.service';

@Controller('radcowie')
export class RadcowieController extends BaseProfilesController {
  constructor(profilesService: ProfilesService) {
    super(profilesService, 'radcowie');
  }
}
