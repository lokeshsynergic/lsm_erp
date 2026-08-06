import { IsString, IsNotEmpty } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  shiftName?: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  graceInTime?: number;

  @IsNotEmpty()
  graceOutTime?: number;

  @IsNotEmpty()
  minimumWorkingHours?: number;

  // @IsNotEmpty()
  // maximumShiftHours?: number;
}