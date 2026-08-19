import { Module } from '@nestjs/common';
import { MasterModule } from './master/master.module';
import { ProductsModule } from './products/products.module';
import { CustomerModule } from './customer/customer.module';


@Module({
  imports: [MasterModule, ProductsModule, CustomerModule],
})
export class InventoryModule {}
