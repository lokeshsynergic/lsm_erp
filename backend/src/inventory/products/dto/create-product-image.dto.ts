import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductImageDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsString()
  @IsNotEmpty()
  document_name: string;

  @IsString()
  @IsNotEmpty()
  document_url: string;
}
