import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingVisitController } from './meeting-visit.controller';
import { MeetingVisitService } from './meeting-visit.service';
import { FieldVisit } from './entities/field_visits.entity';
import { CrmLead } from './entities/leads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldVisit, CrmLead])],
  controllers: [MeetingVisitController],
  providers: [MeetingVisitService],
  exports: [MeetingVisitService],
})
export class MeetingVisitModule {}
