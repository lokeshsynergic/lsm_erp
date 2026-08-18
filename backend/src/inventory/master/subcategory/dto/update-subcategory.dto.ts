import { IsString, IsOptional } from 'class-validator';

export class UpdateSubcategoryDto {
  @IsString()
  @IsOptional()
  subcategory_name?: string;
}
