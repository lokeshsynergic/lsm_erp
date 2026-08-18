import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubcategoryDto {

  @IsNumber()
  @IsNotEmpty()
  category_id?: number;

  @IsString()
  @IsNotEmpty()
  subcategory_name?: string;
}
