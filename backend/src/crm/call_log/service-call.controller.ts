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
import { ServiceCallService } from './service-call.service';
import { CreateServiceCallDto } from './dto/create-service-call.dto';
import { UpdateServiceCallDto } from './dto/update-service-call.dto';
import { ServiceCall } from './entities/service-call.entity';

@Controller('crm/call-log')
export class ServiceCallController {
  constructor(private readonly serviceCallService: ServiceCallService) {}

  /**
   * Create new service call
   * POST /crm/call-log
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createServiceCallDto: CreateServiceCallDto): Promise<ServiceCall> {
    return await this.serviceCallService.create(createServiceCallDto);
  }

  /**
   * Get all service calls
   * GET /crm/call-log
   */
  @Get()
  async findAll(): Promise<ServiceCall[]> {
    return await this.serviceCallService.findAll();
  }

  /**
   * Get service call by ID
   * GET /crm/call-log/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceCall> {
    return await this.serviceCallService.findOne(+id);
  }

  /**
   * Get service call by call number
   * GET /crm/call-log/search/:callNo
   */
  @Get('search/:callNo')
  async findByCallNo(@Param('callNo') callNo: string): Promise<ServiceCall[]> {
    return await this.serviceCallService.findByCallNo(callNo);
  }

  /**
   * Update service call
   * PUT /crm/call-log/:id
   */
  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceCallDto: UpdateServiceCallDto,
  ): Promise<ServiceCall> {
    return await this.serviceCallService.update(+id, updateServiceCallDto);
  }

  /**
   * Delete service call
   * DELETE /crm/call-log/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.serviceCallService.remove(+id);
  }
}
