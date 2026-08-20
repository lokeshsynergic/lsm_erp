import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
} from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  customer_code?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  customer_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  trade_name?: string;

  @IsString()
  customer_type?: string;

  @IsString()
  customer_category?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  primary_contact_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  primary_contact_designation?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  primary_mobile?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  alternate_phone?: string;

  @IsEmail()
  @MaxLength(150)
  primary_email?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  alternate_email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  whatsapp_number?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  billing_address_line1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  billing_address_line2?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  billing_city?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  billing_state?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  billing_pincode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  billing_country?: string;

  @IsBoolean()
  @IsOptional()
  is_shipping_same_as_billing?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  gstin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  pan?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  tan?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  license_no?: string;

  @IsString()
  @IsOptional()
  account_owner_employee_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  lead_source_id?: string;

  @IsDateString()
  @IsOptional()
  customer_since?: string;

  
  @IsOptional()
  account_tier?: string;

  @IsString()
  @IsOptional()
  relationship_status?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
