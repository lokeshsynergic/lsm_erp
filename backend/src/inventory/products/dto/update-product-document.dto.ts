import { IsString, IsOptional } from 'class-validator';

export class UpdateProductDocumentDto {
  @IsString()
  @IsOptional()
  document_name?: string;

  @IsString()
  @IsOptional()
  document_url?: string;
}
