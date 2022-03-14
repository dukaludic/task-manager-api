import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImageSchema } from './image.model';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

import { ImagesassignedModule } from 'src/imagesassigned/imagesassigned.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
    forwardRef(() => ImagesassignedModule),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
