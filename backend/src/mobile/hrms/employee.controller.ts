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
  UploadedFile,
} from '@nestjs/common';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { EmployeeService } from './employee.service';

@Controller('mobile/emp')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('attendance')
  @UseInterceptors(FileInterceptor('image'))
  async checkInOut(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log('📥 Attendance API called');
    console.log('Body:', body);
    console.log('Image:', image?.originalname || 'No image');

    return await this.employeeService.checkInOut(
      body,
      image,
    );
  }

  @Get('attendance/:empcode')
  async getTodayAttendance(@Param('empcode') empcode: string) {
    console.log('📥 Get Today Attendance API called');
    return await this.employeeService.getTodayAttendance(empcode);
  }
}
