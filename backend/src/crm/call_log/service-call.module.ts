import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCall } from './entities/service-call.entity';
import { ServiceCallDocument } from './entities/service-call-image-doc';
import { ServiceCallService } from './service-call.service';
import { ServiceCallController } from './service-call.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCall, ServiceCallDocument])],
  controllers: [ServiceCallController],
  providers: [ServiceCallService],
  exports: [ServiceCallService],
})
export class ServiceCallModule {}
