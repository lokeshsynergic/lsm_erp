import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCall } from './entities/service-call.entity';
import { ServiceCallDocument } from './entities/service-call-image-doc';
import { CreateServiceCallDto } from './dto/create-service-call.dto';
import { UpdateServiceCallDto } from './dto/update-service-call.dto';
import { UploadServiceCallImageDto } from './dto/upload-service-call-image.dto';

@Injectable()
export class ServiceCallService {
  constructor(
    @InjectRepository(ServiceCall)
    private serviceCallRepository: Repository<ServiceCall>,
    @InjectRepository(ServiceCallDocument)
    private serviceCallDocumentRepository: Repository<ServiceCallDocument>,
    // @InjectRepository(ServiceCallImage)
    // private readonly serviceCallImageRepository: Repository<ServiceCallImage>,
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
  //   async findAll(): Promise<ServiceCall[]> {
  //   return await this.serviceCallRepository
  //     .createQueryBuilder('service_call')
  //     .leftJoin('md_hrms_employee', 'emp', 'service_call.engineer = emp.emp_code')
  //     .addSelect(
  //       `CONCAT_WS(' ', emp.first_name, emp.middle_name, emp.last_name)`,
  //       'service_call_engineer_name'
  //     )
  //     .getMany();
  // }

  async findAll(): Promise<any[]> {
  return await this.serviceCallRepository.query(`
    SELECT
      sc.*,
      CONCAT_WS(
        ' ',
        emp.first_name,
        emp.middle_name,
        emp.last_name
      ) AS service_call_engineer_name
    FROM td_crm_service_call sc
    LEFT JOIN md_hrms_employee emp
      ON sc.engineer = emp.emp_code
  `);
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

  /**
   * Upload image/PDF for service call (used when engineer completes task)
   * Saves to: uploads/crm/Calllog/
   */
      async uploadImage(
      callNo: string,
      file: Express.Multer.File,
      uploadServiceCallImageDto: UploadServiceCallImageDto,
    ): Promise<ServiceCallDocument> {
      // 1. Verify service call exists
      const serviceCall = await this.serviceCallRepository.findOne({
        where: { call_no: callNo },
      });

      if (!serviceCall) {
        throw new NotFoundException(`Service call with number ${callNo} not found`);
      }

      // 2. Extract relative image path from Multer
      const imagePath = file.path ? file.path.replace(/\\/g, '/') : `crm/Calllog/${file.filename}`;

      // 3. Map properties explicitly to match ServiceCallDocument schema
      const serviceCallDocument = this.serviceCallDocumentRepository.create({
        serviceCallNo: callNo,
        imagePath: imagePath,
        fileType: file.mimetype || uploadServiceCallImageDto.fileType,
        description: uploadServiceCallImageDto.description,
        createdBy: uploadServiceCallImageDto.createdBy,
      });

      // 4. Persist to td_crm_service_call_doc table
      return await this.serviceCallDocumentRepository.save(serviceCallDocument);
    }
}
