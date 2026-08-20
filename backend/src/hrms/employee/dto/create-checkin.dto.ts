import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateCheckInDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  empcode?: string;

  @IsNotEmpty()
  @IsDateString()
  indatetime?: string;

  @IsOptional()
  @IsNumber()
  inLat?: number;

  @IsOptional()
  @IsNumber()
  inLong?: number;

  @IsOptional()
  @IsString()
  inAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  inPictureUrl?: string;

  @IsOptional()
  @IsNumber()
  isOutOfOffice?: number;
}