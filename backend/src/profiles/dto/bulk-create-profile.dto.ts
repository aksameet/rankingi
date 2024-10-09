// src/profiles/dto/bulk-create-profile.dto.ts
import {
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  IsNumber,
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

  @IsString()
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
}

export class BulkCreateProfileDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProfileDto)
  profiles!: CreateProfileDto[];
}
