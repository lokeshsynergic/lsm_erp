import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) {}

  
  async create(createManufacturerDto: CreateManufacturerDto): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create(createManufacturerDto);
    return await this.manufacturerRepository.save(manufacturer);
  }

  /**
   * Get all departments
   */
  async findAll(): Promise<Manufacturer[]> {
    return await this.manufacturerRepository.find({
      order: {
        manufacturer_id: 'ASC',
      },
    });
  }

  /**
   * Get department by ID
   */
  async findOne(manufacturer_id: number): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { manufacturer_id },
    });
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with ID ${manufacturer_id} not found`);
    }
    return manufacturer;
  }

  /**
   * Update a department
   */
  async update(
    manufacturer_id: number,
    updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<Manufacturer> {
    const manufacturer = await this.findOne(manufacturer_id);
    Object.assign(manufacturer, updateManufacturerDto);
    return await this.manufacturerRepository.save(manufacturer);
  }

  /**
   * Delete a department
   */
  async remove(manufacturer_id: number): Promise<void> {
    const manufacturer = await this.findOne(manufacturer_id);
    await this.manufacturerRepository.remove(manufacturer);
  }
}
