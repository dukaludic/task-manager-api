import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super(); // Configuration should be here for more complex strategies (Facebook login, Google login...)
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    // Validate the user using authService
    const validated = await this.authService.validateUser(username, password);

    // if not validated throw unauthorized exception
    if (!validated) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
