import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from '../../hrms/employee/entities/employee.entity';
import { EmployeeDoc } from '../../hrms/employee/entities/employee-doc.entity'; // 1. Import entity
import { EmployeeAttendance } from '../../hrms/employee/entities/employee-attendance.entity';

@Module({
  imports: [
    // 2. Add EmployeeDoc to forFeature array here 👇
    TypeOrmModule.forFeature([Employee, EmployeeDoc,EmployeeAttendance]), 
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class MobileEmployeeModule {}
