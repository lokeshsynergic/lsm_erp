import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerBankDetailDto } from './dto/create-customer-bank-detail.dto';
import { CreateCustomerDocumentDto } from './dto/create-customer-document.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerBankDetailDto } from './dto/update-customer-bank-detail.dto';
import { UpdateCustomerDocumentDto } from './dto/update-customer-document.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerBankDetail } from './entities/customer-bank-detail.entity';
import { CustomerDocument } from './entities/customer-document.entity';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerBankDetail)
    private customerBankDetailRepository: Repository<CustomerBankDetail>,
    @InjectRepository(CustomerDocument)
    private customerDocumentRepository: Repository<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(this.prepareCustomerPayload(createCustomerDto));
    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      relations: ['bank_details', 'documents'],
      order: { customer_id: 'DESC' },
    });
  }

  async findOne(customer_id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customer_id },
      relations: ['bank_details', 'documents'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customer_id} not found`);
    }

    return customer;
  }

  async update(customer_id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(customer_id);

    Object.assign(customer, this.prepareCustomerPayload(updateCustomerDto));
    return await this.customerRepository.save(customer);
  }

  async remove(customer_id: number): Promise<void> {
    const customer = await this.findOne(customer_id);
    await this.customerRepository.remove(customer);
  }

  async createBankDetail(
    createCustomerBankDetailDto: CreateCustomerBankDetailDto,
  ): Promise<CustomerBankDetail> {
    await this.ensureCustomerExists(createCustomerBankDetailDto.customer_id);

    const bankDetail = this.customerBankDetailRepository.create(createCustomerBankDetailDto);
    return await this.customerBankDetailRepository.save(bankDetail);
  }

  async findBankDetailsByCustomer(customer_id: number): Promise<CustomerBankDetail[]> {
    await this.ensureCustomerExists(customer_id);

    return await this.customerBankDetailRepository.find({
      where: { customer_id },
      order: { bank_account_id: 'DESC' },
    });
  }

  async findOneBankDetail(bank_account_id: number): Promise<CustomerBankDetail> {
    const bankDetail = await this.customerBankDetailRepository.findOne({
      where: { bank_account_id },
    });

    if (!bankDetail) {
      throw new NotFoundException(`Bank account with ID ${bank_account_id} not found`);
    }

    return bankDetail;
  }

  async updateBankDetail(
    bank_account_id: number,
    updateCustomerBankDetailDto: UpdateCustomerBankDetailDto,
  ): Promise<CustomerBankDetail> {
    const bankDetail = await this.findOneBankDetail(bank_account_id);

    Object.assign(bankDetail, updateCustomerBankDetailDto);
    return await this.customerBankDetailRepository.save(bankDetail);
  }

  async removeBankDetail(bank_account_id: number): Promise<void> {
    const bankDetail = await this.findOneBankDetail(bank_account_id);
    await this.customerBankDetailRepository.remove(bankDetail);
  }

  async removeAllBankDetailsByCustomer(customer_id: number): Promise<void> {
    await this.ensureCustomerExists(customer_id);
    await this.customerBankDetailRepository.delete({ customer_id });
  }

  async createDocument(
    createCustomerDocumentDto: CreateCustomerDocumentDto,
  ): Promise<CustomerDocument> {
    await this.ensureCustomerExists(createCustomerDocumentDto.customer_id);

    const document = this.customerDocumentRepository.create(createCustomerDocumentDto);
    return await this.customerDocumentRepository.save(document);
  }

  async findDocumentsByCustomer(customer_id: number): Promise<CustomerDocument[]> {
    await this.ensureCustomerExists(customer_id);

    return await this.customerDocumentRepository.find({
      where: { customer_id },
      order: { document_id: 'DESC' },
    });
  }

  async findOneDocument(document_id: number): Promise<CustomerDocument> {
    const document = await this.customerDocumentRepository.findOne({
      where: { document_id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${document_id} not found`);
    }

    return document;
  }

  async updateDocument(
    document_id: number,
    updateCustomerDocumentDto: UpdateCustomerDocumentDto,
  ): Promise<CustomerDocument> {
    const document = await this.findOneDocument(document_id);

    Object.assign(document, updateCustomerDocumentDto);
    return await this.customerDocumentRepository.save(document);
  }

  async removeDocument(document_id: number): Promise<void> {
    const document = await this.findOneDocument(document_id);
    await this.customerDocumentRepository.remove(document);
  }

  async removeAllDocumentsByCustomer(customer_id: number): Promise<void> {
    await this.ensureCustomerExists(customer_id);
    await this.customerDocumentRepository.delete({ customer_id });
  }

  private async ensureCustomerExists(customer_id: number): Promise<void> {
    const customer = await this.customerRepository.findOne({ where: { customer_id } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customer_id} not found`);
    }
  }

  private prepareCustomerPayload<T extends CreateCustomerDto | UpdateCustomerDto>(payload: T): T {
    if (payload.account_owner_employee_id !== undefined) {
      payload.account_owner_employee_id = payload.account_owner_employee_id.trim();
    }

    return payload;
  }
}
