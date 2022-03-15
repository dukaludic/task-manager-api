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
    return { _id: result };
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
    const imagesassigned = await this.imagesassignedService.getImagesassigned(
      5,
    );
    return imagesassigned;
  }

  @Get('single/:_id')
  async getImageassignedSingle(@Param('_id') _id: string) {
    return this.imagesassignedService.getSingleImageassigned(_id, 5);
  }

  @Get('single/assignment_id/:_id')
  async getImagesassignedByAssignmentId(@Param('_id') _id: string) {
    return await this.imagesassignedService.getSingleImageassignedByAssignmentId(
      _id,
    );
  }

  @Get('assignment_id/:_id')
  async getImagesByAssignmentId(@Param('_id') _id: string) {
    return await this.imagesassignedService.getImagesByAssignmentId(_id);
  }

  @Patch(':_id')
  async updateImageassigned(
    @Param('_id') _id: string,
    @Body('assignment_id') assignment_id: string,
    @Body('image_id') image_id: string,
  ) {
    const result = await this.imagesassignedService.updateImageassigned(
      _id,
      assignment_id,
      image_id,
    );
    return result;
  }

  @Delete(':_id')
  async removeImageassigned(@Param('_id') _id: string) {
    const result = await this.imagesassignedService.deleteImageassigned(_id);
    return result;
  }
}
