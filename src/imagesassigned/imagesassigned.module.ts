import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagesModule } from 'src/images/images.module';

import { ImageassignedSchema } from './imageassigned.model';
import { ImagesassignedController } from './imagesassigned.controller';
import { ImagesassignedService } from './imagesassigned.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Imageassigned', schema: ImageassignedSchema },
    ]),
    forwardRef(() => ImagesModule),
  ],
  controllers: [ImagesassignedController],
  providers: [ImagesassignedService],
  exports: [ImagesassignedService],
})
export class ImagesassignedModule {}
