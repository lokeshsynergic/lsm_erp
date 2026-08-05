import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { DesignationModule } from './designation/designation.module';
import { CategoryModule } from './category/category.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [DepartmentModule,DesignationModule,CategoryModule,DocumentModule],
})
export class MasterModule {}
