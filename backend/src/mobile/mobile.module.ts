import { Module } from '@nestjs/common';
import { MobileAuthModule } from './auth/auth.module';
import { MobileEmployeeModule } from './hrms/employee.module';
import { MobMeetingVisitModule } from './crm/meeting-visit.module';


@Module({
  imports: [MobileAuthModule,MobileEmployeeModule,MobMeetingVisitModule],
})
export class MobileModule {}
