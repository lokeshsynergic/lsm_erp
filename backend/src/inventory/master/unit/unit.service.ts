import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  
  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const unit = this.unitRepository.create(createUnitDto);
    return await this.unitRepository.save(unit);
  }

  /**
   * Get all units
   */
  async findAll(): Promise<Unit[]> {
    return await this.unitRepository.find({
      order: {
        unit_id: 'ASC',
      },
    });
  }

  /**
   * Get unit by ID
   */
  async findOne(unit_id: number): Promise<Unit> {
    const unit = await this.unitRepository.findOne({
      where: { unit_id },
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${unit_id} not found`);
    }
    return unit;
  }

  /**
   * Update a unit
   */
  async update(
    unit_id: number,
    updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    const unit = await this.findOne(unit_id);
    Object.assign(unit, updateUnitDto);
    return await this.unitRepository.save(unit);
  }

  /**
   * Delete a unit
   */
  async remove(unit_id: number): Promise<void> {
    const unit = await this.findOne(unit_id);
    await this.unitRepository.remove(unit);
  }
}
