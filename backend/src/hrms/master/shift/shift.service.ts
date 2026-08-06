import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,
  ) {}

  private calculateShiftHours(startTime: string, endTime: string): number {
  const start = new Date(`1970-01-01T${startTime}`);
  let end = new Date(`1970-01-01T${endTime}`);

  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  return Number(hours.toFixed(2));
  }
//  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
//     const shift = this.shiftRepository.create(createShiftDto);
//     return await this.shiftRepository.save(shift);
//   }
  async create(createShiftDto: CreateShiftDto): Promise<Shift> {

  const shift = this.shiftRepository.create({
    ...createShiftDto,
    maximumShiftHours: this.calculateShiftHours(
      createShiftDto.startTime,
      createShiftDto.endTime,
    ),
  });

  return await this.shiftRepository.save(shift);
}

  async findAll(): Promise<Shift[]> {
    return await this.shiftRepository.find({
      order: {
        shiftCode: 'ASC',
      },
    });
  }

  /**
   * Get shift by ID
   */
  async findOne(shiftCode: number): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { shiftCode },
    });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${shiftCode} not found`);
    }
    return shift;
  }

  /**
   * Update a shift
   */
  async update(
    shiftCode: number,
    updateShiftDto: UpdateShiftDto,
  ): Promise<Shift> {
    const shift = await this.findOne(shiftCode);
    Object.assign(shift, updateShiftDto);
    return await this.shiftRepository.save(shift);
  }

  /**
   * Delete a shift
   */
  async remove(shiftCode: number): Promise<void> {
    const shift = await this.findOne(shiftCode);
    await this.shiftRepository.remove(shift);
  }
}
