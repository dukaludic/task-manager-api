import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlockerSchema } from './blocker.model';
import { BlockersController } from './blockers.controller';
import { BlockersService } from './blockers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Blocker', schema: BlockerSchema }]),
  ],
  controllers: [BlockersController],
  providers: [BlockersService],
  exports: [BlockersService],
})
export class BlockersModule {}
