import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty({ type: UserDto })
  user: UserDto;
}
