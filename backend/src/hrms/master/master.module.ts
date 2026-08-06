import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { DesignationModule } from './designation/designation.module';
import { CategoryModule } from './category/category.module';
import { DocumentModule } from './document/document.module';
import { ShiftModule } from './shift/shift.module';
import { EmployeeModule } from '../employee/employee.module';
@Module({
  imports: [DepartmentModule,DesignationModule,CategoryModule,DocumentModule,ShiftModule,EmployeeModule],
})
export class MasterModule {}
