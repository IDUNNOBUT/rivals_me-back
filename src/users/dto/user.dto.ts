import { User } from '../schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  registeredAt: Date;

  constructor(user: User) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.registeredAt = user.registeredAt;
  }
}
