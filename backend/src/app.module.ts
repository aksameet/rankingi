import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profiles/profile.entity';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // SQLite database file
      entities: [Profile],
      synchronize: true, // Auto-create database schema (development only)
    }),
    ProfilesModule,
  ],
})
export class AppModule {}
