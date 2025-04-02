import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('registration')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration was successfully',
    type: AuthResponseDto,
  })
  async registration(
    @Body() payload: RegistrationDto,
  ): Promise<AuthResponseDto> {
    try {
      return await this.authService.registration(payload);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  @Public()
  @Post('login')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Login was successfully',
    type: AuthResponseDto,
  })
  async login(@Body() payload: LoginDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.login(payload);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
