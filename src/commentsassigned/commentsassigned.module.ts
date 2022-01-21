import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentassignedSchema } from './commentassigned.model';
import { CommentsassignedController } from './commentsassigned.controller';
import { CommentsassignedService } from './commentsassigned.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Commentassigned', schema: CommentassignedSchema },
    ]),
  ],
  controllers: [CommentsassignedController],
  providers: [CommentsassignedService],
  exports: [CommentsassignedService],
})
export class CommentsassignedModule {}
