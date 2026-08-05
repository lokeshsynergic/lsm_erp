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
import { DocumentService } from './document.service';

import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';


@Controller('master/document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    
    return await this.documentService.create(createDocumentDto);
  }


  @Get()
  async findAll(): Promise<Document[]> {
    return await this.documentService.findAll();
  }

  /**
   * Get department by ID
   * GET /department/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document> {
    return await this.documentService.findOne(+id);
  }

  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    return await this.documentService.update(+id, updateDocumentDto);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.documentService.remove(+id);
  }
}
