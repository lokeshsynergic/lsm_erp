import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HrmsModule } from './hrms/hrms.module';
import { CrmModule } from './crm/crm.module';
import { Employee } from './hrms/employee/entities/employee.entity';
import { ServiceCall } from './crm/call_log/entities/service-call.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'lsm_erp',
      autoLoadEntities: true,
      entities: [Employee, ServiceCall],
      synchronize: true,
    }),
    HrmsModule,
    CrmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
