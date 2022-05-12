import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { Express } from 'express';

import { ImagesService } from './images.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('base_64') base_64: string,
    @Body('file_name') file_name: string,
  ) {
    console.log(file, 'file');
    const result = await this.imagesService.insertImage(
      base_64,
      file,
      file_name,
    );
    return { _id: result };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadedImage = await this.imagesService.uploadFile(file);
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleImages') multipleImages: any) {
    const images = await this.imagesService.insertBulkImages(multipleImages);
    return images;
  }

  @Get()
  async getAllImages(@Request() req) {
    const images = await this.imagesService.getImages(5);
    return images;
  }

  @Get(':_id')
  getImageSingle(@Param('_id') _id: string) {
    return this.imagesService.getSingleImage(_id);
  }

  @Patch(':_id')
  async updateImage(
    @Param('_id') _id: string,
    @Body('file_url') file_url: string,
    @Body('base_64') base_64: string,
  ) {
    const result = await this.imagesService.updateImage(_id, file_url, base_64);
    return result;
  }

  @Delete(':_id')
  async removeImage(@Param('_id') _id: string) {
    const result = await this.imagesService.deleteImage(_id);
    return result;
  }
}
