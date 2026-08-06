import { IsString, IsOptional,IsIn } from 'class-validator';

export class UpdateShiftDto {
  @IsString()
  @IsOptional()
  shift_name?: string;

  @IsString()
  @IsOptional()
  start_time?: string;

  @IsString()
  @IsOptional()
  end_time?: string;

  @IsOptional()
  grace_in_time?: number; 

  @IsOptional()
  grace_out_time?: number;

  @IsOptional()
  minimum_working_hours?: number;

  @IsOptional()
  maximum_shift_hours?: number;

  @IsOptional()
  @IsIn(['A', 'I'])
  status?: string;

}
