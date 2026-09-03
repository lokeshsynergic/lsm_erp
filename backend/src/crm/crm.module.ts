import { Module } from '@nestjs/common';
import { ServiceCallModule } from './call_log/service-call.module';
import { MeetingVisitModule } from './meeting-visit/meeting-visit.module';

@Module({
  imports: [ServiceCallModule, MeetingVisitModule],
})
export class CrmModule {}
