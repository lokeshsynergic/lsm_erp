import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  // async getAllUsers() {
  //   return await this.userRepository.find({
  //     select: ['id', 'user_id', 'usertype', 'user_status', 'usermode', 'is_approved', 'approved_by', 'approved_at', 'rejection_reason', 'date_of_birth', 'created_at', 'updated_at'],
  //     order: { created_at: 'DESC' },
  //   });
  // }
async getAllUsers() {
  const query = `
  SELECT 
    u.id,
    u.user_id,
    e.first_name || ' ' || e.middle_name || ' ' || e.last_name AS employee_name,
    u.usertype,
    u.user_status,
    u.usermode,
    u.is_approved,
    u.approved_by,
    u.approved_at,
    u.rejection_reason,
    u.date_of_birth,
    u.created_at,
    u.updated_at
  FROM md_hrms_employee e
  JOIN td_user u
    ON u.user_id = e.emp_code
  ORDER BY u.created_at DESC;
`;

  return await this.dataSource.query(query);
}

  async getWebUsers() {
    return await this.userRepository.find({
      where: { usermode: 'W' },
      select: ['id', 'user_id', 'usertype', 'user_status', 'usermode', 'is_approved', 'approved_by', 'approved_at', 'rejection_reason', 'date_of_birth', 'created_at', 'updated_at'],
      order: { created_at: 'DESC' },
    });
  }

  async getMobileUsers() {
    return await this.userRepository.find({
      where: { usermode: 'M' },
      select: ['id', 'user_id', 'usertype', 'user_status', 'usermode', 'is_approved', 'approved_by', 'approved_at', 'rejection_reason', 'date_of_birth', 'created_at', 'updated_at'],
      order: { created_at: 'DESC' },
    });
  }

  async getUsersByType(usermode: string) {
    return await this.userRepository.find({
      where: { usermode },
      select: ['id', 'user_id', 'usertype', 'user_status', 'usermode', 'is_approved', 'approved_by', 'approved_at', 'rejection_reason', 'date_of_birth', 'created_at', 'updated_at'],
      order: { created_at: 'DESC' },
    });
  }

  async getPendingApprovals() {
    // return await this.userRepository.find({
    //   where: { is_approved: false },
    //   select: ['id', 'user_id', 'usertype', 'user_status', 'usermode', 'is_approved', 'date_of_birth', 'created_at'],
    //   order: { created_at: 'ASC' },
    // });

     const query = `
  SELECT 
    u.id,
    u.user_id,
    e.first_name || ' ' || e.middle_name || ' ' || e.last_name AS employee_name,
    u.usertype,
    u.user_status,
    u.usermode,
    u.is_approved,
    u.date_of_birth,
    u.created_at
  FROM md_hrms_employee e
  JOIN td_user u
    ON u.user_id = e.emp_code  where u.is_approved = false
  ORDER BY u.created_at DESC;
`;

  return await this.dataSource.query(query);
  }

  async approveUser(userId: number, approvedBy: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.is_approved) {
      throw new BadRequestException('User is already approved');
    }

    await this.userRepository.update(
      { id: userId },
      {
        status: 'A',
        is_approved: true,
        approved_by: approvedBy,
        approved_at: new Date(),
        rejection_reason: null,
      }
    );

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return {
      message: 'User approved successfully',
      user: userWithoutPassword,
    };
  }

  async rejectUser(userId: number, reason: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.is_approved) {
      throw new BadRequestException('Cannot reject an already approved user');
    }

    await this.userRepository.update(
      { id: userId },
      {
        rejection_reason: reason,
      }
    );

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return {
      message: 'User rejected',
      user: userWithoutPassword,
    };
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete({ id: userId });

    return {
      message: 'User deleted successfully',
    };
  }
}
