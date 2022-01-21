import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Imageassigned } from './imageassigned.model';

@Injectable()
export class ImagesassignedService {
  constructor(
    @InjectModel('Imageassigned')
    private readonly imageassignedModel: Model<Imageassigned>,
  ) {}

  async insertImageassigned(assignment_id: string, image_id: string) {
    const newImageassigned = new this.imageassignedModel({
      assignment_id,
      image_id,
    });

    console.log(newImageassigned, '===newImageassigned');

    const result = await newImageassigned.save();
    return result.id as string;
  }

  async insertBulkImagesassigned(multipleImagesassigned: any[]) {
    const availabilities = await this.imageassignedModel.insertMany(
      multipleImagesassigned,
    );
    return availabilities;
  }

  async getImagesassigned(limiter: number) {
    const imagesassigned = await this.imageassignedModel.find().exec();
    return imagesassigned;
  }

  async getSingleImageassigned(id: string, limiter: number) {
    const imageassigned = await this.imageassignedModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return imageassigned;
  }

  async updateImageassigned(
    id: string,
    assignment_id: string,
    image_id: string,
  ) {
    const updatedImageassigned = await this.findImageassigned(id);
    if (assignment_id) {
      updatedImageassigned.assignment_id = assignment_id;
    }
    if (image_id) {
      updatedImageassigned.image_id = image_id;
    }
    updatedImageassigned.save();
    return updatedImageassigned;
  }

  async deleteImageassigned(imageassignedId: string) {
    const result = await this.imageassignedModel
      .deleteOne({ id: imageassignedId })
      .exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findImageassigned(id: string): Promise<Imageassigned> {
    let imageassigned;
    try {
      imageassigned = await this.imageassignedModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find imageassigned.');
    }
    if (!imageassigned) {
      throw new NotFoundException('Could not find imageassigned.');
    }
    return imageassigned;
  }
}
