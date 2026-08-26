import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HrmsModule } from './hrms/hrms.module';
import { CrmModule } from './crm/crm.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Employee } from './hrms/employee/entities/employee.entity';
import { ServiceCall } from './crm/call_log/entities/service-call.entity';
import { User } from './auth/entities/user.entity';
import { MobileModule } from './mobile/mobile.module';
import { InventoryModule } from './inventory/inventory.module';
import * as path from 'path';

@Module({
  imports: [
    // 1. Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '..', '.env'),
    }),

    // 2. Use forRootAsync so TypeORM waits until ConfigService is ready
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: configService.get<string>('DATABASE_NAME', 'lsm_erp'),
        autoLoadEntities: true,
        entities: [Employee, ServiceCall, User],
        synchronize: true,
      }),
    }),

    AuthModule,
    HrmsModule,
    CrmModule,
    UsersModule,
    MobileModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}