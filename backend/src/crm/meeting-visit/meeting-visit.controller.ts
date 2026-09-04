import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/multer.config';
import { MeetingVisitService } from './meeting-visit.service';

import { CreateClientVisitDto } from './dto/create-client-visit.dto';
import { UpdateClientVisitDto } from './dto/update-client-visit.dto';
import { VisitLogFilterDto } from './dto/visit-log-filter.dto';

import { CrmLead } from './entities/leads.entity';
import { FieldVisit } from './entities/field_visits.entity';

@Controller('crm/meeting-visit')
export class MeetingVisitController {
  constructor(private readonly meetingVisitService: MeetingVisitService) {

  }
   

  @Get()
  async findAll(): Promise<FieldVisit[]> {
    return await this.meetingVisitService.findAll();
  }

  /**
   * Get Visit Log Dashboard with filters
   * GET /crm/meeting-visit/dashboard/visit-logs
   * Query params: from_date, to_date, emp_code, product, organization, outcome
   */
  @Get('dashboard/visit-logs')
  async getVisitLogDashboard(
    @Query() filters: VisitLogFilterDto,
  ): Promise<any[]> {
    return await this.meetingVisitService.getVisitLogDashboard(filters);
  }

  /**
   * Search by call number (MUST BE PLACED BEFORE :id TO PREVENT ROUTE MATCHING ISSUES)
   * GET /crm/meeting-visit/search/:callNo
   */
  @Get('search/:callNo')
  async findByCallNo(@Param('callNo') callNo: string): Promise<FieldVisit[]> {
    return await this.meetingVisitService.findByCallNo(callNo);
  }

  /**
   * Get meeting visit by ID
   * GET /crm/meeting-visit/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FieldVisit> {
    return await this.meetingVisitService.findOne(id);
  }

  /**
   * Update meeting visit
   * PUT /crm/meeting-visit/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientVisitDto: UpdateClientVisitDto,
  ): Promise<FieldVisit> {
    return await this.meetingVisitService.update(id, updateClientVisitDto);
  }

  /**
   * Update visit review status with remarks and follow-up actions
   * PUT /crm/meeting-visit/:id/review
   */
  @Put(':id/review')
  async updateVisitReview(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      visitReviewStatus: string;
      remarks: string;
    },
  ): Promise<FieldVisit> {
    return await this.meetingVisitService.updateVisitReview(
      id,
      body.visitReviewStatus,
      body.remarks
    );
  }

  /**
   * Delete meeting visit
   * DELETE /crm/meeting-visit/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.meetingVisitService.remove(id);
  }
}