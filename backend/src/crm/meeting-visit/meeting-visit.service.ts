import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FieldVisit } from './entities/field_visits.entity';
import { CrmLead } from './entities/leads.entity';
import { CreateClientVisitDto } from './dto/create-client-visit.dto';
import { UpdateClientVisitDto } from './dto/update-client-visit.dto';
import { VisitLogFilterDto } from './dto/visit-log-filter.dto'; 
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

  /**
   * Get Visit Log Dashboard data with filters
   * Accepts: from_date, to_date, emp_code, product, organization, outcome
   * Returns filtered and sorted visit logs
   */
  async getVisitLogDashboard(filters: VisitLogFilterDto): Promise<any[]> {
    let query = this.fieldVisitRepository
      .createQueryBuilder('fv')
      .leftJoinAndSelect('fv.lead', 'lead')
      .select([
        'fv.visitId',
        'fv.salesRepId',
        'fv.checkInTime',
        'fv.visitOutcome',
        'lead.companyName',
        'lead.leadId',
        'fv.visitReviewStatus',
        'fv.remarks',
        'fv.discussionNotes',
        'fv.expectedValue',
      ]);

    // Filter by date range (from_date and to_date)
    if (filters.from_date) {
      const fromDate = new Date(filters.from_date);
      query = query.andWhere('fv.checkInTime >= :fromDate', { fromDate });
    }

    if (filters.to_date) {
      const toDate = new Date(filters.to_date);
      toDate.setHours(23, 59, 59, 999); // End of day
      query = query.andWhere('fv.checkInTime <= :toDate', { toDate });
    }

    // Filter by employee code (sales rep ID)
    if (filters.emp_code) {
      query = query.andWhere('fv.salesRepId = :empCode', { empCode: filters.emp_code });
    }

    // Filter by visit outcome
    if (filters.outcome) {
      query = query.andWhere('fv.visitOutcome = :outcome', { outcome: filters.outcome });
    }

    // Filter by organization (company name)
    if (filters.organization) {
      query = query.andWhere('lead.companyName ILIKE :organization', {
        organization: `%${filters.organization}%`,
      });
    }

    // Note: Product filter will be added later when product field is available

    // Default order by date DESC
    query = query.orderBy('fv.checkInTime', 'DESC');

    const visits = await query.getMany();

    // Map the data to the dashboard format
    return visits.map((visit, index) => ({
      slNo: index + 1,
      visitId: visit.visitId,
      dateTimeOfVisit: visit.checkInTime,
      nameOfEmployee: visit.salesRepId, // Will be replaced with actual employee name after joining with HRMS
      organizationName: visit.lead?.companyName || 'N/A',
      product: 'TBD', // To be added later
      visitOutcome: visit.visitOutcome || 'N/A',
      visitReviewStatus: visit.visitReviewStatus || 'Pending Review',
      remarks: visit.remarks || '',
      discussionNotes: visit.discussionNotes || 'N/A',
      expectedValue: visit.expectedValue || 'N/A', // To be implemented based on business logic
    }));
  }

  /**
   * Update visit review status with remarks and follow-up actions
   */
  async updateVisitReview(
    visitId: number,
    visitReviewStatus: string,
    remarks: string,
  ): Promise<FieldVisit> {
    const visit = await this.findOne(visitId);
    
    visit.visitReviewStatus = visitReviewStatus;
    visit.remarks = remarks;    
    return await this.fieldVisitRepository.save(visit);
  }
}