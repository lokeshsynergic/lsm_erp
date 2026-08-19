import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductImageDto {
  @IsString()
  @IsOptional()
  document_name?: string;

  @IsString()
  @IsOptional()
  document_url?: string;
}
