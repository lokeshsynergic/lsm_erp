import { IsString, IsOptional } from 'class-validator';

export class UpdateUnitDto {
  @IsString()
  @IsOptional()
  unit_name?: string;
}
