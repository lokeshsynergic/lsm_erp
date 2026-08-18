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
import { ManufacturerService } from './manufacturer.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { Manufacturer } from './entities/manufacturer.entity';

@Controller('invt/master/manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createManufacturerDto: CreateManufacturerDto): Promise<Manufacturer> {
    return await this.manufacturerService.create(createManufacturerDto);
  }


  @Get()
  async findAll(): Promise<Manufacturer[]> {
    return await this.manufacturerService.findAll();
  }

  /**
   * Get department by ID
   * GET /department/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Manufacturer> {
    return await this.manufacturerService.findOne(+id);
  }

  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<Manufacturer> {
    return await this.manufacturerService.update(+id, updateManufacturerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.manufacturerService.remove(+id);
  }
}
