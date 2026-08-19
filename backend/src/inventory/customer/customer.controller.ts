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
import { CreateCustomerBankDetailDto } from './dto/create-customer-bank-detail.dto';
import { CreateCustomerDocumentDto } from './dto/create-customer-document.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerBankDetailDto } from './dto/update-customer-bank-detail.dto';
import { UpdateCustomerDocumentDto } from './dto/update-customer-document.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerBankDetail } from './entities/customer-bank-detail.entity';
import { CustomerDocument } from './entities/customer-document.entity';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './customer.service';


@Controller('invt/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customerService.create(createCustomerDto);
  }

  @Get()
  async findAllCustomers(): Promise<Customer[]> {
    return await this.customerService.findAll();
  }

  @Get(':id')
  async findOneCustomer(@Param('id') id: string): Promise<Customer> {
    return await this.customerService.findOne(+id);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    await this.customerService.remove(+id);
  }

  @Post(':customer_id/bank-detail')
  @HttpCode(HttpStatus.CREATED)
  async addBankDetail(
    @Param('customer_id') customer_id: string,
    @Body() createCustomerBankDetailDto: CreateCustomerBankDetailDto,
  ): Promise<CustomerBankDetail> {
    createCustomerBankDetailDto.customer_id = +customer_id;
    return await this.customerService.createBankDetail(createCustomerBankDetailDto);
  }

  @Get(':customer_id/bank-details')
  async getCustomerBankDetails(
    @Param('customer_id') customer_id: string,
  ): Promise<CustomerBankDetail[]> {
    return await this.customerService.findBankDetailsByCustomer(+customer_id);
  }

  @Get('bank-detail/:bank_account_id')
  async getBankDetail(
    @Param('bank_account_id') bank_account_id: string,
  ): Promise<CustomerBankDetail> {
    return await this.customerService.findOneBankDetail(+bank_account_id);
  }

  @Put('bank-detail/:bank_account_id')
  async updateBankDetail(
    @Param('bank_account_id') bank_account_id: string,
    @Body() updateCustomerBankDetailDto: UpdateCustomerBankDetailDto,
  ): Promise<CustomerBankDetail> {
    return await this.customerService.updateBankDetail(
      +bank_account_id,
      updateCustomerBankDetailDto,
    );
  }

  @Delete('bank-detail/:bank_account_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBankDetail(@Param('bank_account_id') bank_account_id: string): Promise<void> {
    await this.customerService.removeBankDetail(+bank_account_id);
  }

  @Delete(':customer_id/bank-details')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllCustomerBankDetails(@Param('customer_id') customer_id: string): Promise<void> {
    await this.customerService.removeAllBankDetailsByCustomer(+customer_id);
  }

  @Post(':customer_id/document')
  @HttpCode(HttpStatus.CREATED)
  async addDocument(
    @Param('customer_id') customer_id: string,
    @Body() createCustomerDocumentDto: CreateCustomerDocumentDto,
  ): Promise<CustomerDocument> {
    createCustomerDocumentDto.customer_id = +customer_id;
    return await this.customerService.createDocument(createCustomerDocumentDto);
  }

  @Get(':customer_id/documents')
  async getCustomerDocuments(
    @Param('customer_id') customer_id: string,
  ): Promise<CustomerDocument[]> {
    return await this.customerService.findDocumentsByCustomer(+customer_id);
  }

  @Get('document/:document_id')
  async getDocument(@Param('document_id') document_id: string): Promise<CustomerDocument> {
    return await this.customerService.findOneDocument(+document_id);
  }

  @Put('document/:document_id')
  async updateDocument(
    @Param('document_id') document_id: string,
    @Body() updateCustomerDocumentDto: UpdateCustomerDocumentDto,
  ): Promise<CustomerDocument> {
    return await this.customerService.updateDocument(+document_id, updateCustomerDocumentDto);
  }

  @Delete('document/:document_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(@Param('document_id') document_id: string): Promise<void> {
    await this.customerService.removeDocument(+document_id);
  }

  @Delete(':customer_id/documents')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllCustomerDocuments(@Param('customer_id') customer_id: string): Promise<void> {
    await this.customerService.removeAllDocumentsByCustomer(+customer_id);
  }
}

