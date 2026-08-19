import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerBankDetailDto {
  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  account_number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  ifsc_code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  account_holder_name: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}
