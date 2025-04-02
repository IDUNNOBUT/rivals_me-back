import { BadRequestException, Injectable } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(user: RegistrationDto): Promise<AuthResponseDto> {
    const newUser = new UserDto(await this.userService.addUser(user));
    return {
      accessToken: this.jwtService.sign({ ...newUser }),
      user: newUser,
    };
  }

  async login(data: LoginDto) {
    try {
      const user = await this.userService.getUserByEmail(data.email);
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (!passwordMatch) throw new BadRequestException('Неправильный пароль');
      const responseUser = new UserDto(user);
      return {
        accessToken: this.jwtService.sign({ ...responseUser }),
        user: responseUser,
      };
    } catch {
      throw new BadRequestException('Email и / или пароль неправильные');
    }
  }
}
