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
import { BranchService } from './branch.service';


import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';


@Controller('master/branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    return await this.branchService.create(createBranchDto);
  }


  @Get()
  async findAll(): Promise<Branch[]> {
    return await this.branchService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Branch> {
    return await this.branchService.findOne(+id);
  }

  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    return await this.branchService.update(+id, updateBranchDto);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.branchService.remove(+id);
  }
}
