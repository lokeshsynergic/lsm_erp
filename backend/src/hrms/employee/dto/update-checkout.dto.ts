import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class UpdateCheckOutDto {
  @IsNotEmpty()
  @IsDateString()
  outDttime?: string;

  @IsOptional()
  @IsNumber()
  outLat?: number;

  @IsOptional()
  @IsNumber()
  outLong?: number;

  @IsOptional()
  @IsString()
  outAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  outPictureUrl?: string;
}