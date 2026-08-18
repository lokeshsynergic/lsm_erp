import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('web')
  async getWebUsers() {
    return await this.usersService.getWebUsers();
  }

  @Get('mobile')
  async getMobileUsers() {
    return await this.usersService.getMobileUsers();
  }

  @Get('by-type')
  async getUsersByType(@Query('type') type: string) {
    return await this.usersService.getUsersByType(type);
  }

  @Get('pending-approvals')
  async getPendingApprovals() {
    return await this.usersService.getPendingApprovals();
  }

  @Post(':id/approve')
  async approveUser(
    @Param('id') userId: number,
    @Body() body: { approved_by: string }
  ) {
    return await this.usersService.approveUser(userId, body.approved_by);
  }

  @Post(':id/reject')
  async rejectUser(
    @Param('id') userId: number,
    @Body() body: { reason: string }
  ) {
    return await this.usersService.rejectUser(userId, body.reason);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: number) {
    return await this.usersService.deleteUser(userId);
  }
}
