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
    return { id: result };
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
    console.log('getAllSettings');
    const settings = await this.settingsService.getSettings(5);
    return settings;
  }

  @Get(':id')
  getSettingSingle(@Param('id') id: string) {
    return this.settingsService.getSingleSetting(id, 5);
  }

  @Patch(':id')
  async updateSetting(
    @Param('id') id: string,
    @Body('user_id') user_id: string,
    @Body('name') name: string,
    @Body('value') value: string,
  ) {
    const result = await this.settingsService.updateSetting(
      id,
      user_id,
      name,
      value,
    );
    return result;
  }

  @Delete(':id')
  async removeSetting(@Param('id') id: string) {
    const result = await this.settingsService.deleteSetting(id);
    return result;
  }
}
