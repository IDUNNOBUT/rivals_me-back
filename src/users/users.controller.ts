import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  async getUser(@Param('id') id: string): Promise<UserDto> {
    try {
      return this.usersService.getUserById(id);
    } catch (e) {
      return e;
    }
  }

  @Patch()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  async updateUser(
    @Req() req,
    @Body() payload: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      return this.usersService.updateUser(req.user.id, payload);
    } catch (e) {
      return e;
    }
  }

  @Delete()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  async deleteUser(@Req() req): Promise<UserDto> {
    try {
      return this.usersService.deleteUser(req.user.id);
    } catch (e) {
      return e;
    }
  }
}
