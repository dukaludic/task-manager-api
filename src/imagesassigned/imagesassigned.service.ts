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
    return result._id as string;
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

  async getImagesassignedByImageId(_id: string) {
    console.log(_id, '_id');
    const imageassigned = await this.imageassignedModel
      .findOne({
        image_id: {
          $eq: _id,
        },
      })
      .exec();

    return imageassigned;
  }

  async getSingleImageassigned(_id: string, limiter: number) {
    const imageassigned = await this.imageassignedModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    return imageassigned;
  }

  async getImagesByAssignmentId(_id: string) {
    const imagesassigned = await this.imageassignedModel
      .find({
        assignment_id: {
          $eq: _id,
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

  async getSingleImageassignedByAssignmentId(_id: string) {
    const imageassigned = await this.imageassignedModel
      .findOne({
        assignment_id: {
          $eq: _id,
        },
      })
      .exec();

    return imageassigned;
  }

  async updateImageassigned(
    _id: string,
    assignment_id: string,
    image_id: string,
  ) {
    const updatedImageassigned = await this.findImageassigned(_id);
    if (assignment_id) {
      updatedImageassigned.assignment_id = assignment_id;
    }
    if (image_id) {
      updatedImageassigned.image_id = image_id;
    }
    updatedImageassigned.save();
    return updatedImageassigned;
  }

  async deleteImageassigned(_id: string) {
    const deletedImageassigned = await this.imageassignedModel
      .deleteOne({ _id: { $eq: _id } })
      .exec();

    return {
      message: `Deleted ${deletedImageassigned.deletedCount} item from database`,
    };
  }

  private async findImageassigned(_id: string): Promise<Imageassigned> {
    let imageassigned;
    try {
      imageassigned = await this.imageassignedModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find imageassigned.');
    }
    if (!imageassigned) {
      throw new NotFoundException('Could not find imageassigned.');
    }
    return imageassigned;
  }
}
