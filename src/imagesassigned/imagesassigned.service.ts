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

import { ImagesService } from '../images/images.service';

@Injectable()
export class ImagesassignedService {
  constructor(
    @InjectModel('Imageassigned')
    private readonly imageassignedModel: Model<Imageassigned>,
    @Inject(forwardRef(() => ImagesService))
    private imagesService: ImagesService,
  ) {}

  async insertImageassigned(assignment_id: string, image_id: string) {
    const newImageassigned = new this.imageassignedModel({
      assignment_id,
      image_id,
    });

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

  async getImagesassignedByImageId(id: string) {
    console.log(id, 'id');
    const imageassigned = await this.imageassignedModel
      .findOne({
        image_id: {
          $eq: id,
        },
      })
      .exec();

    return imageassigned;
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

  async getImagesByAssignmentId(id: string) {
    const imagesassigned = await this.imageassignedModel
      .find({
        assignment_id: {
          $eq: id,
        },
      })
      .exec();

    const imagesCollection = [];

    for (let i = 0; i < imagesassigned.length; i++) {
      const image = await this.imagesService.getSingleImage(
        imagesassigned[i].image_id,
      );

      imagesCollection.push(image);
    }

    return imagesCollection;
  }

  async getSingleImageassignedByAssignmentId(id: string) {
    const imageassigned = await this.imageassignedModel
      .findOne({
        assignment_id: {
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

  async deleteImageassigned(id: string) {
    const deletedImageassigned = await this.imageassignedModel
      .deleteOne({ _id: { $eq: id } })
      .exec();

    return {
      message: `Deleted ${deletedImageassigned.deletedCount} item from database`,
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
