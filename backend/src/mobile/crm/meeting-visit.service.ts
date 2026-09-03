import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FieldVisit } from '../../crm/meeting-visit/entities/field_visits.entity';
import { CrmLead } from '../../crm/meeting-visit/entities/leads.entity';
import { CreateClientVisitDto } from '../../crm/meeting-visit/dto/create-client-visit.dto';
import { UpdateClientVisitDto } from '../../crm/meeting-visit/dto/update-client-visit.dto'; 
import path from 'path/win32';
import fs from 'fs';
@Injectable()
export class MeetingVisitService {
  constructor(
    @InjectRepository(FieldVisit)
    private readonly fieldVisitRepository: Repository<FieldVisit>,
    @InjectRepository(CrmLead)
    private readonly crmLeadRepository: Repository<CrmLead>,
  ) {}

   private async uploadVisitImage(
  salesRepId: string | undefined,
  image: Express.Multer.File,
  type: 'visiting_card' | 'selfie',
): Promise<string> {
  // Fallback if salesRepId is missing in DTO
  const safeSalesRepId = salesRepId ? String(salesRepId) : 'system';

  const uploadPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'meeting',
    type,
    safeSalesRepId, // Guarantees a string argument
  );

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const extension = path.extname(image.originalname) || '.jpg';
  const fileName = `${type}_${Date.now()}${extension}`;
  const fullPath = path.join(uploadPath, fileName);

  fs.writeFileSync(fullPath, image.buffer);

  return path.join('uploads', 'meeting', type, safeSalesRepId, fileName).replace(/\\/g, '/');
}

async create(
  dto: CreateClientVisitDto,
  files?: {
    visitingCard?: Express.Multer.File[];
    selfie?: Express.Multer.File[];
  },
): Promise<FieldVisit> {
  let resolvedLeadId: number | undefined = dto.leadId;

  // 1. If companyName or phone is provided, treat as a New Lead
  if (dto.companyName || dto.phone) {
    const lead = this.crmLeadRepository.create({
      companyName: dto.companyName || 'New Field Prospect',
      contactPerson: dto.contactPerson || 'N/A',
      phone: dto.phone || 'N/A',
      email: dto.email || '',
      leadSource: dto.leadSource || 'Field Visit',
      createdBy: dto.salesRepId,
    });
    const savedLead = await this.crmLeadRepository.save(lead);
    resolvedLeadId = savedLead.leadId;
  } 
  // 2. If an existing leadId is passed, verify it exists
  else if (dto.leadId) {
    const existingLead = await this.crmLeadRepository.findOne({
      where: { leadId: dto.leadId },
    });
    if (existingLead) {
      resolvedLeadId = existingLead.leadId;
    }
  }

  // 3. Fallback: Create a default lead entry if no lead was supplied/found
  if (!resolvedLeadId) {
    const fallbackLead = this.crmLeadRepository.create({
      companyName: dto.companyName,
      contactPerson: 'N/A',
      phone: 'N/A',
      leadSource: 'Field Visit',
      createdBy: dto.salesRepId,
    });
    const savedFallback = await this.crmLeadRepository.save(fallbackLead);
    resolvedLeadId = savedFallback.leadId;
  }

  // Process uploaded files
  let visitingCardUrl: string | undefined;
  let selfieUrl: string | undefined;

  if (files?.visitingCard?.[0]) {
    visitingCardUrl = await this.uploadVisitImage(dto.salesRepId, files.visitingCard[0], 'visiting_card');
  }
  if (files?.selfie?.[0]) {
    selfieUrl = await this.uploadVisitImage(dto.salesRepId, files.selfie[0], 'selfie');
  }

  // 4. Create Visit record with validated lead relation
  const visitData: Partial<FieldVisit> = {
    salesRepId: dto.salesRepId,
    checkInLat: dto.checkInLat,
    checkInLong: dto.checkInLong,
    checkInTime: dto.checkInTime ? new Date(dto.checkInTime) : new Date(),
    visitPurpose: dto.visitPurpose || 'Cold Call',
    isScheduled: dto.isScheduled ?? false,
    visitOutcome: dto.visitOutcome || 'Interested',
    
    discussionNotes: dto.discussionNotes || '',
    nextFollowupDate: dto.nextFollowupDate ? new Date(dto.nextFollowupDate) : undefined,
    expectedValue: dto.expectedValue,
    checkOutLat: dto.checkOutLat,
    checkOutLong: dto.checkOutLong,
    checkOutTime: dto.checkOutTime ? new Date(dto.checkOutTime) : undefined,
    durationMinutes: dto.durationMinutes,
    visitingCardUrl,
    selfieUrl,
    meet_person_desig: dto.meetPersonDesig || '',
    lead: { leadId: resolvedLeadId } as CrmLead,
  };

  const visit = this.fieldVisitRepository.create(visitData);
  return await this.fieldVisitRepository.save(visit);
}

  /**
   * Get all visits along with their Lead details
   */
  async findAll(): Promise<FieldVisit[]> {
    return await this.fieldVisitRepository.find({
      relations: ['lead'], // Automatically fetches the linked CrmLead data
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a specific visit by ID
   */
  async findOne(visitId: number): Promise<FieldVisit> {
    const visit = await this.fieldVisitRepository.findOne({
      where: { visitId },
      relations: ['lead'],
    });

    if (!visit) {
      throw new NotFoundException(`Field Visit with ID ${visitId} not found`);
    }
    return visit;
  }

  /**
   * Search visits by sales rep ID (Replacing the old "findByCallNo")
   */
  async findByCallNo(salesRepId: string): Promise<FieldVisit[]> {
    return await this.fieldVisitRepository.find({
      where: { salesRepId },
      relations: ['lead'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update a visit
   */
  async update(visitId: number, updateData: UpdateClientVisitDto): Promise<FieldVisit> {
    const visit = await this.findOne(visitId);
    Object.assign(visit, updateData);
    return await this.fieldVisitRepository.save(visit);
  }

  /**
   * Delete a visit
   */
  async remove(visitId: number): Promise<void> {
    const visit = await this.findOne(visitId);
    await this.fieldVisitRepository.remove(visit);
  }
}