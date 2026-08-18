import { IsString, IsNotEmpty } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  manufacturer_name?: string;
}
