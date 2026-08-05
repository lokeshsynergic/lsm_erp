import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { MasterModule } from './master/master.module';

@Module({
  imports: [EmployeeModule, MasterModule],
})
export class HrmsModule {}
