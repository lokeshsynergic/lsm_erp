import { PartialType } from '@nestjs/mapped-types';
import { CreateClientVisitDto } from './create-client-visit.dto';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// 1. DTO for creating/passing inline Lead details
export class UpdateLeadDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  contactPerson!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  leadSource?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;
}

// 2. Master DTO combining Visit, Check-in/out, and Lead data
export class UpdateClientVisitDto extends PartialType(CreateClientVisitDto) {
  @IsString()
  @IsNotEmpty()
  salesRepId!: string;

  @IsNumber()
  @IsOptional()
  customerId?: number;

  @IsNumber()
  @IsOptional()
  leadId?: number; // Pass if visiting an existing lead

  // Nested object: Pass if creating a new lead during the visit
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateLeadDto)
  newLead?: UpdateLeadDto;

  // Check-in Details
  @IsNumber()
  @IsNotEmpty()
  checkInLat!: number;

  @IsNumber()
  @IsNotEmpty()
  checkInLong!: number;

  @IsDateString()
  @IsOptional()
  checkInTime?: string;

  // Visit Details
  @IsString()
  @IsOptional()
  visitPurpose?: string;

  @IsBoolean()
  @IsOptional()
  isScheduled?: boolean;

  @IsString()
  @IsOptional()
  visitOutcome?: string;

  @IsString()
  @IsOptional()
  discussionNotes?: string;

  @IsDateString()
  @IsOptional()
  nextFollowupDate?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  expectedValue?: number;

  // Check-out Details
  @IsNumber()
  @IsOptional()
  checkOutLat?: number;

  @IsNumber()
  @IsOptional()
  checkOutLong?: number;

  @IsDateString()
  @IsOptional()
  checkOutTime?: string;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;
}