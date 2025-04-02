import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { AddUserDto } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addUser(user: AddUserDto): Promise<User> {
    const candidate = await this.userModel.findOne({ email: user.email });

    if (candidate)
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );

    user.password = bcrypt.hashSync(user.password, 10);
    return await this.userModel.create(user);
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<UserDto> {
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) throw new BadRequestException('Пользователь не найден');

    return new UserDto(updatedUser);
  }

  async deleteUser(id: string): Promise<UserDto> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) throw new BadRequestException('Пользователь не найден');

    return new UserDto(deletedUser);
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('Пользователь не найден');

    return new UserDto(user);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }
}
