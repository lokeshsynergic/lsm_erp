import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ShiftService } from './shift.service';

import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';


@Controller('master/shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createShiftDto: CreateShiftDto): Promise<Shift> {
    return await this.shiftService.create(createShiftDto);
  }


  @Get()
  async findAll(): Promise<Shift[]> {
    return await this.shiftService.findAll();
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Shift> {
    return await this.shiftService.findOne(+id);
  }

  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto,
  ): Promise<Shift> {
    return await this.shiftService.update(+id, updateShiftDto);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.shiftService.remove(+id);
  }
}
