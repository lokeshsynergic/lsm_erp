import { Module } from '@nestjs/common';

import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [CategoryModule, SubcategoryModule, ManufacturerModule, UnitModule],
})
export class MasterModule {}
