import { Module } from '@nestjs/common';

import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { UnitModule } from './unit/unit.module';
import { ProductTypeModule } from './product_type/product-type.module';

@Module({
  imports: [CategoryModule, SubcategoryModule, ManufacturerModule, UnitModule,ProductTypeModule],
})
export class MasterModule {}
