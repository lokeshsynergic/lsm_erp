import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerBankDetailDto } from './create-customer-bank-detail.dto';

export class UpdateCustomerBankDetailDto extends PartialType(CreateCustomerBankDetailDto) {}
