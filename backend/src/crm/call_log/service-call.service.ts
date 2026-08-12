import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCall } from './entities/service-call.entity';
import { CreateServiceCallDto } from './dto/create-service-call.dto';
import { UpdateServiceCallDto } from './dto/update-service-call.dto';

@Injectable()
export class ServiceCallService {
  constructor(
    @InjectRepository(ServiceCall)
    private serviceCallRepository: Repository<ServiceCall>,
  ) {}

  /**
   * Generate call number with format LSM-YYYY-XXX
   */
  private async generateCallNo(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `LSM-${year}-`;
    
    // Get all call numbers for this year using raw query
    const result = await this.serviceCallRepository
      .createQueryBuilder('service_call')
      .select('COUNT(service_call.id)', 'count')
      .where('service_call.call_no LIKE :prefix', { prefix: `${prefix}%` })
      .getRawOne();
    
    const count = result?.count ? parseInt(result.count, 10) : 0;
    const sequenceNo = String(count + 1).padStart(3, '0');
    return `${prefix}${sequenceNo}`;
  }

  /**
   * Create a new service call
   */
  async create(createServiceCallDto: CreateServiceCallDto): Promise<ServiceCall> {
    const call_no = await this.generateCallNo();
    const call_date = createServiceCallDto.call_date || new Date();
    
    const serviceCall = this.serviceCallRepository.create({
      ...createServiceCallDto,
      call_no,
      call_date,
    });
    return await this.serviceCallRepository.save(serviceCall);
  }

  /**
   * Get all service calls
   */
    async findAll(): Promise<ServiceCall[]> {
    return await this.serviceCallRepository
      .createQueryBuilder('service_call')
      .leftJoin('md_hrms_employee', 'engineer', 'service_call.engineer = engineer.emp_code')
      .addSelect(
        `CONCAT_WS(' ', engineer.first_name, engineer.middle_name, engineer.last_name)`,
        'service_call_engineer_name'
      )
      .getMany();
  }

  /**
   * Get service call by ID
   */
  async findOne(id: number): Promise<ServiceCall> {
    const serviceCall = await this.serviceCallRepository.findOne({
      where: { id },
    });
    if (!serviceCall) {
      throw new NotFoundException(`Service call with ID ${id} not found`);
    }
    return serviceCall;
  }

  /**
   * Get service call by call number
   */
  async findByCallNo(call_no: string): Promise<ServiceCall[]> {
    return await this.serviceCallRepository.find({
      where: { call_no },
    });
  }

  /**
   * Update a service call
   */
  async update(
    id: number,
    updateServiceCallDto: UpdateServiceCallDto,
  ): Promise<ServiceCall> {
    const serviceCall = await this.findOne(id);
    Object.assign(serviceCall, updateServiceCallDto);
    return await this.serviceCallRepository.save(serviceCall);
  }

  /**
   * Delete a service call
   */
  async remove(id: number): Promise<void> {
    const serviceCall = await this.findOne(id);
    await this.serviceCallRepository.remove(serviceCall);
  }
}
