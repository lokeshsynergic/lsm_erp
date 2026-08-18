import { IsString, IsOptional } from 'class-validator';

export class UpdateManufacturerDto {
  @IsString()
  @IsOptional()
  manufacturer_name?: string;
}
