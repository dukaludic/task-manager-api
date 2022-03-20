import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  Res,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Res({ passthrough: true }) response: Response): any {
    const jwt = this.authService.login(req.user);
    console.log(jwt);
    return jwt;
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('projects')
  // getProjects(@Request() req): string {
  //   return req.user;
  // }
}
