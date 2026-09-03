import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingVisitController } from './meeting-visit.controller';
import { MeetingVisitService } from './meeting-visit.service';
import { FieldVisit } from '../../crm/meeting-visit/entities/field_visits.entity';
import { CrmLead } from '../../crm/meeting-visit/entities/leads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldVisit, CrmLead])],
  controllers: [MeetingVisitController],
  providers: [MeetingVisitService],
  exports: [MeetingVisitService],
})
export class MobMeetingVisitModule {}
