import { Module } from '@nestjs/common';
import { ServiceCallModule } from './call_log/service-call.module';

@Module({
  imports: [ServiceCallModule],
})
export class CrmModule {}
