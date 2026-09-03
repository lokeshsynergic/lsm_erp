import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClientVisitDto {
  // --- Sales Rep ---
  @IsString()
  @IsNotEmpty()
  salesRepId!: string;

  // --- Lead Identification ---
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  leadId?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  customerId?: number;

  // --- Inline New Lead Fields (Flattened for multipart forms) ---
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  leadSource?: string;

  // --- Check-in Details ---
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  checkInLat!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  checkInLong!: number;

  @IsDateString()
  @IsOptional()
  checkInTime?: string;

  // --- Visit Details ---
  @IsString()
  @IsOptional()
  visitPurpose?: string;

  @Transform(({ value }) => value === 'true' || value === true)
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

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  @Min(0)
  expectedValue?: number;

  // --- Check-out Details ---
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  checkOutLat?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  checkOutLong?: number;

  @IsDateString()
  @IsOptional()
  checkOutTime?: string;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @IsString()
  @IsOptional()
  visitingCardUrl?: string;

  @IsString()
  @IsOptional()
  selfieUrl?: string;

  @IsString()
  @IsOptional()
  meetPersonDesig?: string;
}