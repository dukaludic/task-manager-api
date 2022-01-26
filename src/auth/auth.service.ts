import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Find if user in database
    const user = await this.usersService.findOne(username);

    // If user exists and passwords match return the user object without the username and password
    if (user && user.password === password) {
      const { password, username, ...rest } = user;
      return rest;
    }

    // Otherwise return NULL
    return null;
  }

  async login(user: any) {
    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
