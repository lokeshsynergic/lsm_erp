import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { MobileAuthController } from './auth.controller';
import { User } from '../../auth/entities/user.entity';
import { Employee } from '../../hrms/employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee])],
  controllers: [MobileAuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class MobileAuthModule {}
