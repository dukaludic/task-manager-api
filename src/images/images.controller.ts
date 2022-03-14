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
} from '@nestjs/common';

import { ImagesService } from './images.service';

// @UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  async addImage(
    @Body('file_url') file_url: string,
    @Body('base_64') base_64: string,
  ) {
    const result = await this.imagesService.insertImage(file_url, base_64);
    return { id: result };
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

  @Get(':id')
  getImageSingle(@Param('id') id: string) {
    return this.imagesService.getSingleImage(id);
  }

  @Patch(':id')
  async updateImage(
    @Param('id') id: string,
    @Body('file_url') file_url: string,
    @Body('base_64') base_64: string,
  ) {
    const result = await this.imagesService.updateImage(id, file_url, base_64);
    return result;
  }

  @Delete(':id')
  async removeImage(@Param('id') id: string) {
    const result = await this.imagesService.deleteImage(id);
    return result;
  }
}
