import { IsString, IsNotEmpty, IsNumber, IsDecimal, IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsOptional()
  cost_price?: number;

  @IsDecimal()
  @IsOptional()
  selling_price?: number;

  @IsNumber()
  @IsOptional()
  stock_quantity?: number;

  @IsNumber()
  @IsOptional()
  unit_id?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsOptional()
  @IsDate()
  discontinueDate?: Date | null;   
}
