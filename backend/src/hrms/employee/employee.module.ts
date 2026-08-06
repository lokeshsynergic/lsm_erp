import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeDoc } from './entities/employee-doc.entity'; // 1. Import entity

@Module({
  imports: [
    // 2. Add EmployeeDoc to forFeature array here 👇
    TypeOrmModule.forFeature([Employee, EmployeeDoc]), 
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
