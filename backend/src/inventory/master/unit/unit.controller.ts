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
import { UnitService } from './unit.service';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('invt/master/unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return await this.unitService.create(createUnitDto);
  }


  @Get()
  async findAll(): Promise<Unit[]> {
    return await this.unitService.findAll();
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Unit> {
    return await this.unitService.findOne(+id);
  }

  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    return await this.unitService.update(+id, updateUnitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.unitService.remove(+id);
  }
}
