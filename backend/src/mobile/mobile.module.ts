import { Module } from '@nestjs/common';
import { MobileAuthModule } from './auth/auth.module';
import { MobileEmployeeModule } from './hrms/employee.module';


@Module({
  imports: [MobileAuthModule,MobileEmployeeModule],
})
export class MobileModule {}
