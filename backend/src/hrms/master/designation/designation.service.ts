import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from './entities/designation.entity';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
  ) {}

  /**
   * Create a new designation
   */
  async create(createDesignationDto: CreateDesignationDto): Promise<Designation> {
    const designation = this.designationRepository.create(createDesignationDto);
    return await this.designationRepository.save(designation);
  }

  /**
   * Get all designations
   */
  async findAll(): Promise<Designation[]> {
    return await this.designationRepository.find({
      order: {
        desig_id: 'ASC',
      },
    });
  }

  /**
   * Get designation by ID
   */
  async findOne(desig_id: number): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: { desig_id },
    });
    if (!designation) {
      throw new NotFoundException(`Designation with ID ${desig_id} not found`);
    }
    return designation;
  }

  /**
   * Update a designation
   */
  async update(
    desig_id: number,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    const designation = await this.findOne(desig_id);
    Object.assign(designation, updateDesignationDto);
    return await this.designationRepository.save(designation);
  }

  /**
   * Delete a designation
   */
  async remove(desig_id: number): Promise<void> {
    const designation = await this.findOne(desig_id);
    await this.designationRepository.remove(designation);
  }
}
