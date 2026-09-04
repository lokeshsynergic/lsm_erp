import { Module } from '@nestjs/common';
import { MobileAuthModule } from './auth/auth.module';
import { MobileEmployeeModule } from './hrms/employee.module';
import { MobMeetingVisitModule } from './crm/meeting-visit.module';
import { MobileProductModule } from './invent/products.module';


@Module({
  imports: [MobileAuthModule,MobileEmployeeModule,MobMeetingVisitModule, MobileProductModule],
})
export class MobileModule {}
