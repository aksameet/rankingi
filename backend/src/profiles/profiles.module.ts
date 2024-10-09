// src/profiles/profiles.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile, ProfileSchema } from './schemas/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Default', schema: ProfileSchema }]),
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
