import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Setting } from './setting.model';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel('Setting') private readonly settingModel: Model<Setting>,
  ) {}

  async insertSetting(user_id: string, name: string, value: string) {
    const newSetting = new this.settingModel({
      user_id,
      name,
      value,
    });

    const result = await newSetting.save();
    return result.id as string;
  }

  async insertBulkSettings(multipleSettings: any[]) {
    const availabilities = await this.settingModel.insertMany(multipleSettings);
    return availabilities;
  }

  async getSettings(limiter: number) {
    const settings = await this.settingModel.find().exec();
    return settings;
  }

  async getSingleSetting(id: string, limiter: number) {
    const setting = await this.settingModel
      .findOne({
        id: {
          $eq: id,
        },
      })
      .exec();

    return setting;
  }

  async updateSetting(
    id: string,
    user_id: string,
    name: string,
    value: string,
  ) {
    const updatedSetting = await this.findSetting(id);
    if (user_id) {
      updatedSetting.user_id = user_id;
    }
    if (name) {
      updatedSetting.name = name;
    }
    if (value) {
      updatedSetting.value = value;
    }

    updatedSetting.save();
    return updatedSetting;
  }

  async deleteSetting(settingId: string) {
    const result = await this.settingModel.deleteOne({ id: settingId }).exec();
    return {
      message: `Deleted ${result.deletedCount} item from database`,
    };
  }

  private async findSetting(id: string): Promise<Setting> {
    let setting;
    try {
      setting = await this.settingModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find setting.');
    }
    if (!setting) {
      throw new NotFoundException('Could not find setting.');
    }
    return setting;
  }
}
