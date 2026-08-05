import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  
  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = this.documentRepository.create(createDocumentDto);
    return await this.documentRepository.save(document);
  }

  /**
   * Get all departments
   */
  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find({
      order: {
        doc_id: 'ASC',
      },
    });
  }

  /**
   * Get department by ID
   */
  async findOne(doc_id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { doc_id },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${doc_id} not found`);
    }
    return document;
  }

  /**
   * Update a department
   */
  async update(
    doc_id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document = await this.findOne(doc_id);
    Object.assign(document, updateDocumentDto);
    return await this.documentRepository.save(document);
  }

  /**
   * Delete a department
   */
  async remove(doc_id: number): Promise<void> {
    const document = await this.findOne(doc_id);
    await this.documentRepository.remove(document);
  }
}
