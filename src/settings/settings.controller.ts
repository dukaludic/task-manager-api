import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';

import { SettingsService } from './settings.service';

// @UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  async addSetting(
    @Body('user_id') user_id: string,
    @Body('name') name: string,
    @Body('value') value: string,
  ) {
    const result = await this.settingsService.insertSetting(
      user_id,
      name,
      value,
    );
    return { _id: result };
  }

  @Post('/multiple')
  async addMultiple(@Body('multipleSettings') multipleSettings: any) {
    const settings = await this.settingsService.insertBulkSettings(
      multipleSettings,
    );
    return settings;
  }

  @Get()
  async getAllSettings(@Request() req) {
    const settings = await this.settingsService.getSettings(5);
    return settings;
  }

  @Get(':_id')
  getSettingSingle(@Param('_id') _id: string) {
    return this.settingsService.getSingleSetting(_id, 5);
  }

  @Patch(':_id')
  async updateSetting(
    @Param('_id') _id: string,
    @Body('user_id') user_id: string,
    @Body('name') name: string,
    @Body('value') value: string,
  ) {
    const result = await this.settingsService.updateSetting(
      _id,
      user_id,
      name,
      value,
    );
    return result;
  }

  @Delete(':_id')
  async removeSetting(@Param('_id') _id: string) {
    const result = await this.settingsService.deleteSetting(_id);
    return result;
  }
}
