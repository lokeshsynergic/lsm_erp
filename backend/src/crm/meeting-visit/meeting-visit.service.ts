import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FieldVisit } from './entities/field_visits.entity';
import { CrmLead } from './entities/leads.entity';
import { CreateClientVisitDto } from './dto/create-client-visit.dto';
import { UpdateClientVisitDto } from './dto/update-client-visit.dto'; 
@Injectable()
export class MeetingVisitService {
  constructor(
    @InjectRepository(FieldVisit)
    private readonly fieldVisitRepository: Repository<FieldVisit>,
    @InjectRepository(CrmLead)
    private readonly crmLeadRepository: Repository<CrmLead>,
  ) {}

  /**
   * Create a new Field Visit (and optionally a new Lead)
   */
  

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