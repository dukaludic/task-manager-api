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

import { S3 } from 'aws-sdk';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    @Inject(forwardRef(() => ImagesassignedService))
    private ImagesassignedService: ImagesassignedService,
  ) {}

  async upload(image_buffer: Buffer, file_name: string) {
    const s3 = new S3();

    const upload = await s3
      .upload({
        Bucket: 'grapes-task-manager-storage',
        Body: image_buffer,
        Key: `${uuidv4()}-${file_name}`,
      })
      .promise();

    // console.log(s3, 'S3');
  }

  async delete(file_name: string) {
    const s3 = new S3();

    const deleteImage = await s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME!,
        Key: file_name,
      })
      .promise();
  }

  // https://grapes-task-manager-storage.s3.eu-central-1.amazonaws.com/pexels-lukas-669615.jpg

  async insertImage(
    file_url: string,
    base_64: string,
    file: any,
    file_name: string,
  ) {
    const s3 = new S3();

    console.log(file, 'file_name 1');

    const key = `${file_name}-${uuidv4()}`;
    file_url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}/${key}`;

    console.log(file_url, 'file_url');
    console.log(file.mimetype, 'mimetype');

    const upload = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET!,
        Body: file.buffer,
        Key: key,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      })
      .promise();

    // console.log(upload, 'upload');

    const newImage = new this.imageModel({
      file_url,
      base_64,
      file_name,
    });

    const result = await newImage.save();
    return result._id as string;
  }

  /////////////////////////

  s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async uploadFile(file) {
    const { originalname } = file;

    await this.s3_upload(file, originalname);
  }

  async s3_upload(file, file_name) {
    const key = `${file_name}-${uuidv4()}`;
    const params = {
      Bucket: process.env.AWS_BUCKET!,
      Body: file.buffer,
      Key: key,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      // CreateBucketConfiguration: {
      //   LocationConstraint: 'ap-south-1',
      // },
    };

    console.log(params);

    try {
      let s3Response = await this.s3.upload(params).promise();

      console.log(s3Response);
    } catch (e) {
      console.log(e);
    }
  }

  ///////////////////////

  async insertBulkImages(multipleImages: any[]) {
    const availabilities = await this.imageModel.insertMany(multipleImages);
    return availabilities;
  }

  async getImages(limiter: number) {
    const images = await this.imageModel.find().exec();
    return images;
  }

  async getSingleImage(_id: string) {
    const image = await this.imageModel
      .findOne({
        _id: {
          $eq: _id,
        },
      })
      .exec();

    return image;
  }

  async updateImage(_id: string, file_url: string, base_64: string) {
    const updatedImage = await this.findImage(_id);
    if (file_url) {
      updatedImage.file_url = file_url;
    }
    if (base_64) {
      updatedImage.base_64 = base_64;
    }

    updatedImage.save();
    return updatedImage;
  }

  async deleteImage(_id: string) {
    const imageassigned =
      await this.ImagesassignedService.getImagesassignedByImageId(_id);

    console.log(imageassigned, 'imageassigned');

    const deleteImageassigned =
      await this.ImagesassignedService.deleteImageassigned(imageassigned?._id);

    const result = await this.imageModel
      .deleteOne({ _id: { $eq: _id } })
      .exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findImage(_id: string): Promise<Image> {
    let image;
    try {
      image = await this.imageModel.findById(_id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find image.');
    }
    if (!image) {
      throw new NotFoundException('Could not find image.');
    }
    return image;
  }
}
