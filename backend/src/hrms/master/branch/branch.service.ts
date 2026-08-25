import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  
  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const branch = this.branchRepository.create(createBranchDto);
    return await this.branchRepository.save(branch);
  }

  /**
   * Get all branches
   */
  async findAll(): Promise<Branch[]> {
    return await this.branchRepository.find({
      order: {
        branch_id: 'ASC',
      },
    });
  }

  /**
   * Get branch by ID
   */
  async findOne(branch_id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { branch_id },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branch_id} not found`);
    }
    return branch;
  }

  /**
   * Update a branch
   */
  async update(
    branch_id: number,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    const branch = await this.findOne(branch_id);
    Object.assign(branch, updateBranchDto);
    return await this.branchRepository.save(branch);
  }

  /**
   * Delete a branch
   */
  async remove(branch_id: number): Promise<void> {
    const branch = await this.findOne(branch_id);
    await this.branchRepository.remove(branch);
  }
}
