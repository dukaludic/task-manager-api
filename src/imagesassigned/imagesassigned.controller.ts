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

import { ImagesassignedService } from './imagesassigned.service';

// @UseGuards(JwtAuthGuard)
@Controller('imagesassigned')
export class ImagesassignedController {
  constructor(private readonly imagesassignedService: ImagesassignedService) {}

  @Post()
  async addImageassigned(
    @Body('assignment_id') assignment_id: string,
    @Body('image_id') image_id: string,
  ) {
    const result = await this.imagesassignedService.insertImageassigned(
      assignment_id,
      image_id,
    );
    return { id: result };
  }

  @Post('/multiple')
  async addMultiple(
    @Body('multipleImagesassigned') multipleImagesassigned: any,
  ) {
    const imagesassigned =
      await this.imagesassignedService.insertBulkImagesassigned(
        multipleImagesassigned,
      );
    return imagesassigned;
  }

  @Get()
  async getAllImagesassigned(@Request() req) {
    console.log('getAllImagesassigned');
    const imagesassigned = await this.imagesassignedService.getImagesassigned(
      5,
    );
    return imagesassigned;
  }

  @Get('single/:id')
  getImageassignedSingle(@Param('id') id: string) {
    return this.imagesassignedService.getSingleImageassigned(id, 5);
  }

  @Get('assignment_id/:id')
  getImagesassignedByAssignmentId(@Param('id') id: string) {
    return this.imagesassignedService.getSingleImageassignedByAssignmentId(id);
  }

  @Patch(':id')
  async updateImageassigned(
    @Param('id') id: string,
    @Body('assignment_id') assignment_id: string,
    @Body('image_id') image_id: string,
  ) {
    const result = await this.imagesassignedService.updateImageassigned(
      id,
      assignment_id,
      image_id,
    );
    return result;
  }

  @Delete(':id')
  async removeImageassigned(@Param('id') id: string) {
    const result = await this.imagesassignedService.deleteImageassigned(id);
    return result;
  }
}
