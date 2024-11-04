// src/profiles/dto/bulk-create-profile.dto.ts
import {
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsEmail()
  email!: string;

  @IsNumber()
  @IsOptional()
  rank?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  geolocation?: string;

  @IsNumber()
  @IsOptional()
  stars?: number;

  @IsNumber()
  @IsOptional()
  opinions?: number;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  city!: string;

  @IsString()
  company!: string;

  @IsString()
  own_stars!: string;
}

export class BulkCreateProfileDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProfileDto)
  profiles!: CreateProfileDto[];
}
