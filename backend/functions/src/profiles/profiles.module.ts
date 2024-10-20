// src/profiles/profiles.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './controllers/profiles.controller';
import { AdwokaciController } from './controllers/adwokaci.controller';
import { RadcowieController } from './controllers/radcowie.controller';

@Module({
  imports: [MongooseModule], // Ensure MongooseModule is imported
  providers: [ProfilesService],
  controllers: [ProfilesController, AdwokaciController, RadcowieController],
})
export class ProfilesModule {}
