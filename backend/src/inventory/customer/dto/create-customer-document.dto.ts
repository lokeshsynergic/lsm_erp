import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { CustomerDocumentType } from '../entities/customer-document.entity';

export class CreateCustomerDocumentDto {
  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @IsEnum(CustomerDocumentType)
  document_type: CustomerDocumentType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  document_name: string;

  @IsString()
  @IsNotEmpty()
  document_url: string;
}
