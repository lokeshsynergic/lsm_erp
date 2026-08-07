import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateServiceCallDto {
  @IsString()
  @IsOptional()
  call_no?: string;

  @IsDateString()
  @IsOptional()
  call_date?: Date;

  @IsString()
  @IsOptional()
  customer?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  contact_person?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  engineer?: string;

  @IsString()
  @IsOptional()
  equipment_name?: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  serial_no?: string;

  @IsString()
  @IsOptional()
  asset_id?: string;

  @IsString()
  @IsOptional()
  complaint_reported?: string;

  @IsString()
  @IsOptional()
  service_type?: string;

  @IsString()
  @IsOptional()
  action_taken?: string;

  @IsString()
  @IsOptional()
  spare_parts?: string;

  @IsString()
  @IsOptional()
  equipment_status?: string;
}
