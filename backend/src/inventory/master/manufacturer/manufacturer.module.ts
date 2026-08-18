import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerController } from './manufacturer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  controllers: [ManufacturerController],
  providers: [ManufacturerService],
  exports: [TypeOrmModule, ManufacturerService],
})
export class ManufacturerModule {} // Ensures ManufacturerModule is properly exported