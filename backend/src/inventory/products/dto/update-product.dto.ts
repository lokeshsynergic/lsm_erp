import { IsString, IsOptional, IsDecimal, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  product_name?: string;

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

  @IsString()
  @IsOptional()
  status?: string;
}
