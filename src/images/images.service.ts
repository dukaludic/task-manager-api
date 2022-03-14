import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Image } from './image.model';

import { ImagesassignedService } from 'src/imagesassigned/imagesassigned.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    @Inject(forwardRef(() => ImagesassignedService))
    private ImagesassignedService: ImagesassignedService,
  ) {}

  async insertImage(file_url: string, base_64: string) {
    const newImage = new this.imageModel({
      file_url,
      base_64,
    });

    const result = await newImage.save();
    return result.id as string;
  }

  async insertBulkImages(multipleImages: any[]) {
    const availabilities = await this.imageModel.insertMany(multipleImages);
    return availabilities;
  }

  async getImages(limiter: number) {
    const images = await this.imageModel.find().exec();
    return images;
  }

  async getSingleImage(id: string) {
    const image = await this.imageModel
      .findOne({
        _id: {
          $eq: id,
        },
      })
      .exec();

    return image;
  }

  async updateImage(id: string, file_url: string, base_64: string) {
    const updatedImage = await this.findImage(id);
    if (file_url) {
      updatedImage.file_url = file_url;
    }
    if (base_64) {
      updatedImage.base_64 = base_64;
    }

    updatedImage.save();
    return updatedImage;
  }

  async deleteImage(id: string) {
    const imageassigned =
      await this.ImagesassignedService.getImagesassignedByImageId(id);

    console.log(imageassigned, 'imageassigned');

    const deleteImageassigned =
      await this.ImagesassignedService.deleteImageassigned(imageassigned?._id);

    const result = await this.imageModel.deleteOne({ _id: { $eq: id } }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findImage(id: string): Promise<Image> {
    let image;
    try {
      image = await this.imageModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find image.');
    }
    if (!image) {
      throw new NotFoundException('Could not find image.');
    }
    return image;
  }
}
