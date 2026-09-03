import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { MeetingVisitService } from './meeting-visit.service';

import { CreateClientVisitDto } from '../../crm/meeting-visit/dto/create-client-visit.dto'; 
import { UpdateClientVisitDto } from '../../crm/meeting-visit/dto/update-client-visit.dto';


import { CrmLead } from '../../crm/meeting-visit/entities/leads.entity';
import { FieldVisit } from '../../crm/meeting-visit/entities/field_visits.entity';

@Controller('mobile/meeting-visit')
export class MeetingVisitController {
  constructor(private readonly meetingVisitService: MeetingVisitService) {}

@Post()
@HttpCode(HttpStatus.CREATED)
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'visitingCard', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
)
async create(
  @Body() createClientVisitDto: CreateClientVisitDto,
  @UploadedFiles()
  files: {
    visitingCard?: Express.Multer.File[];
    selfie?: Express.Multer.File[];
  },
): Promise<FieldVisit> {
  return await this.meetingVisitService.create(createClientVisitDto, files);
}

  
  @Get()
  async findAll(): Promise<FieldVisit[]> {
    return await this.meetingVisitService.findAll();
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
   * Delete meeting visit
   * DELETE /crm/meeting-visit/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.meetingVisitService.remove(id);
  }

  
}