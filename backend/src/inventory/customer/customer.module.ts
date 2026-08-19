import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerBankDetail } from './entities/customer-bank-detail.entity';
import { CustomerDocument } from './entities/customer-document.entity';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerBankDetail, CustomerDocument])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [TypeOrmModule, CustomerService],
})
export class CustomerModule {}
