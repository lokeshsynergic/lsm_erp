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
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Designation } from './entities/designation.entity';

@Controller('master/desig')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDesignationDto: CreateDesignationDto): Promise<Designation> {
    return await this.designationService.create(createDesignationDto);
  }


  @Get()
  async findAll(): Promise<Designation[]> {
    return await this.designationService.findAll();
  }

 
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Designation> {
    return await this.designationService.findOne(+id);
  }

  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    return await this.designationService.update(+id, updateDesignationDto);
  }

  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.designationService.remove(+id);
  }
}
